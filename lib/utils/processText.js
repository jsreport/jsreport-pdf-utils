// remove hidden tags like group@@@
// find form@@@ and create pdf widgets

const CMapFactory = require('pdfjs-dist/lib/core/cmap.js').CMapFactory
const StringStream = require('pdfjs-dist/lib/core/stream.js').StringStream
const zlib = require('zlib')
const FormsProcessor = require('./formsProcessor')

function chunkArray (myArray, chunkSize) {
  var index = 0
  var arrayLength = myArray.length
  var tempArray = []

  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize)
    tempArray.push(myChunk)
  }

  return tempArray
}

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

function getAllIndexes (arr, marks) {
  let indexes = []
  for (let mark of marks) {
    let i = -1
    while ((i = arr.indexOf(`${mark}@@@`, i + 1)) !== -1) {
      indexes.push({
        start: i,
        end: arr.indexOf('@@@', i + `${mark}@@@`.length) + '@@@'.length
      })
    }
  }

  return indexes
}

async function processStream (doc, streamObject, { page, pages, pageIndex, cmapCache, formsProcessor, removeHiddenMarks, hiddenPageFields }) {
  // we just support known structures chrome produces
  if (!streamObject.object.properties.get('Filter')) {
    return
  }

  const lines = zlib.unzipSync(streamObject.content).toString('latin1').split('\n')

  let currentPosition
  let currentFontRef
  let text = ''
  let details = []
  let height
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]

    // do is an xobject reference, the xobject can also contain the text we want process so we go in with recursion
    if (line.endsWith('Do')) {
      // we just support known structures chrome produces
      // all kind of things can go wrong here when processing output of static pdf or from phantomjs..
      let xobjectContent
      let xobjectObject
      try {
        const xObjectRef = line.split(' ')[0].substring(1)
        const xObject = page.properties.get('Resources').get('XObject').get(xObjectRef)
        xobjectContent = xObject.object.content
        xobjectObject = xObject.object
      } catch (e) {
        continue
      }
      await processStream(doc, xobjectContent, {
        page: xobjectObject,
        pages,
        pageIndex,
        cmapCache,
        formsProcessor,
        removeHiddenMarks,
        hiddenPageFields
      })
    }

    // the very first cm contains the page height
    if (line.endsWith('cm') && height == null) {
      const fragments = line.split(' ')
      const matrix = fragments.slice(0, fragments.length - 1)
      height = parseFloat(matrix[5])
    }

    // font reference for text parsing
    if (line.endsWith('Tf')) {
      currentFontRef = line.split(' ')[0].substring(1)
    }

    // text position so we know where to put form input
    if (line.endsWith('Tm')) {
      const fragments = line.split(' ')
      currentPosition = fragments.slice(fragments.length - 3, fragments.length - 1).map(n => parseFloat(n))
    }

    // the actual text represented in 4 hex chars for every character
    // the hex chars are references to the cmap where we get actual char code
    if (line.endsWith('Tj')) {
      // somehow the line can contain something like this
      // .546875 0 Td <0056> Tj
      // and I want just the Tj, don't know what is the previous part
      const trimStart = line.indexOf('<')
      let trimedLine = line.substring(trimStart)

      let cmap
      // we just support known structures chrome produces
      // all kind of things can go wrong here when processing output of static pdf or from phantomjs..
      let cmapContentStr
      try {
        const cmapStream = page.properties.get('Resources').get('Font').get(currentFontRef).object.properties.get('ToUnicode').object
        cmap = cmapCache.get(cmapStream)
        if (cmap == null) {
          cmapContentStr = zlib.unzipSync(cmapStream.content.content).toString('latin1')
          const stream = new StringStream(cmapContentStr)
          cmap = await CMapFactory.create({
            encoding: stream
          })
          cmapCache.set(cmapStream, cmap)
        }
      } catch (e) {
        continue
      }

      const hexes = trimedLine.split(' ')[0].replace(/</g, '').replace(/>/g, '')

      let charIndex = trimStart + 1
      for (const charSeq of chunkArray(hexes, 4)) {
        let ch = cmap.lookup(parseInt(charSeq, 16))
        if (ch == null) {
          continue
        }

        if (ch.charCodeAt(0) === 0) {
          ch = ch.substring(1)
        }

        text += ch
        details.push({ lineIndex, charIndex, ch, position: currentPosition, length: charSeq.length })

        charIndex += 4
      }
    }
  }

  let indexes = getAllIndexes(text, removeHiddenMarks ? ['group', 'item', 'form'] : ['form'])

  if (indexes.length === 0) {
    return
  }

  const removeLines = []
  for (const index of indexes) {
    let detailsToProcess = details.slice(index.start, index.end)

    if (detailsToProcess.length > 0) {
      const text = detailsToProcess.map(d => d.ch).join('')
      if (text.includes('form@@@')) {
        const trimmedText = text.substring('form@@@'.length, text.length - '@@@'.length)
        const valueOfText = hiddenPageFields[trimmedText]
        if (valueOfText != null) {
          await formsProcessor({
            doc,
            text: valueOfText,
            position: detailsToProcess[0].position,
            page: pages[pageIndex].object,
            pageIndex,
            height,
            hiddenPageFields
          })
        }
      }
    }

    // now we remove the text from stream
    let detailsByLines = groupBy(detailsToProcess, 'lineIndex')

    for (let lineIndex in detailsByLines) {
      lineIndex = parseInt(lineIndex)
      const lineDetails = detailsByLines[lineIndex]
      let line = lines[lineIndex]
      line = line.substring(0, lineDetails[0].charIndex) +
             // somehow the cusom font uses just 2 hex chars instead of 4, don't get this
             // the solution here is likely buggy
             line.substring(lineDetails[lineDetails.length - 1].charIndex + lineDetails[lineDetails.length - 1].length)
      if (line.includes('<>')) {
        removeLines.push(lineIndex)
      } else {
        lines[lineIndex] = line
      }
    }
  }

  const filteredLines = lines.filter((l, i) => removeLines.find(ri => ri === i) == null)

  streamObject.content = zlib.deflateSync(filteredLines.join('\n'))
  streamObject.object.prop('Length', streamObject.content.length)
}

module.exports = async (doc, ext, {
  removeHiddenMarks,
  hiddenPageFields
}) => {
  let pageIndex = 0
  try {
    for (const page of ext.pages.get('Kids')) {
      const pageObject = page.object
      const streamObject = pageObject.properties.get('Contents').object.content
      await processStream(doc, streamObject, {
        page: pageObject,
        pages: ext.pages.get('Kids'),
        pageIndex,
        cmapCache: new Map(),
        formsProcessor: FormsProcessor(doc, ext),
        removeHiddenMarks,
        hiddenPageFields
      })
      pageIndex++
    }
  } catch (e) {
    if (e.isFormError) {
      throw e
    }

    console.warn('pdf utils failed to remove the hidden marks from pdf, this has no significant impact, but please report the issue.', e)
  }
}
