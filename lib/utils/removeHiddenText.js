const CMapFactory = require('pdfjs-dist/lib/core/cmap.js').CMapFactory
const StringStream = require('pdfjs-dist/lib/core/stream.js').StringStream
const zlib = require('zlib')

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
        end: arr.indexOf('@@@', `${mark}@@@`.length) + '@@@'.length
      })
    }
  }

  return indexes
}

async function process (streamObject, page, cmapCache) {
  // we just support known structures chrome produces
  if (!streamObject.object.properties.get('Filter')) {
    return
  }

  const lines = zlib.unzipSync(streamObject.content).toString('latin1').split('\n')

  let currentFontRef
  let text = ''
  let details = []
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
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
      await process(xobjectContent, xobjectObject, cmapCache)
    }

    if (line.endsWith('Tf')) {
      currentFontRef = line.split(' ')[0].substring(1)
    }

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
        if (ch.charCodeAt(0) === 0) {
          ch = ch.substring(1)
        }
        text += ch
        details.push({ lineIndex, charIndex })
        charIndex += 4
      }
    }
  }

  let indexes = getAllIndexes(text, ['group', 'item'])

  if (indexes.length === 0) {
    return
  }

  const removeLines = []
  for (const index of indexes) {
    let detailsToProcess = details.slice(index.start, index.end)
    let detailsByLines = groupBy(detailsToProcess, 'lineIndex')

    for (let lineIndex in detailsByLines) {
      lineIndex = parseInt(lineIndex)
      const lineDetails = detailsByLines[lineIndex]
      let line = lines[lineIndex]
      line = line.substring(0, lineDetails[0].charIndex) + line.substring(lineDetails[lineDetails.length - 1].charIndex + 4)
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

module.exports = async (extDocument) => {
  try {
    for (const page of extDocument.pages.get('Kids')) {
      const pageObject = page.object
      const streamObject = pageObject.properties.get('Contents').object.content
      await process(streamObject, pageObject, new Map())
    }
  } catch (e) {
    console.warn('pdf utils failed to remove the hidden marks from pdf, this has no significant impact, but please report the issue.', e)
  }
}
