const pdfjs = require('pdfjs')
const PDFDictionary = require('pdfjs/lib/object/dictionary')
const zlib = require('zlib')
const EmbeddedPdf = require('./EmbeddedPdf')

function uint8ToString (u8a) {
  const CHUNK_SZ = 0x8000
  const c = []
  for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)))
  }
  return c.join('')
}

module.exports = (contentBuffer, pages) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const doc = new pdfjs.Document({
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })

  function addToPage (page, buffers) {
    let xObjIndex = 1
    let finalMergeStream = ''

    buffers.forEach((buffer) => {
      const xobj = new EmbeddedPdf(buffer)
      const mergeStream = xobj.page.get('Contents').object.content
      mergeStream.content = zlib.unzipSync(mergeStream.content).toString('ascii')
      mergeStream.content = mergeStream.content.replace(/[0-9 ]+re\nf/, '')

      mergeStream.object.prop('Length', mergeStream.content.length)
      mergeStream.object.prop('Filter', null)
      doc._doc._useXObject(xobj)

      const xobjKey = Object.keys(doc._doc._xobjects).find((k) => doc._doc._xobjects[k].x === xobj)
      const resourcesOrRef = page.object.properties.get('Resources')
      const resources = resourcesOrRef.object ? resourcesOrRef.object.properties : resourcesOrRef

      const xnum = `X${xObjIndex++}.0`
      if (resources.has('XObject')) {
        resources.get('XObject').add(xnum, doc._doc._xobjects[xobjKey].o[0].reference)
      } else {
        resources.set('XObject', new PDFDictionary({
          [xnum]: doc._doc._xobjects[xobjKey].o[0].reference
        }))
      }

      /* pageStream.content = 'q\n' + pageStream.content + '\nQ\n'
      pageStream.writeLine('q')
      pageStream.writeLine('1 0 0 1 0 0 cm')
      pageStream.writeLine(`/${xnum} Do`)
      pageStream.writeLine('Q')

      pageStream.object.prop('Filter', null) */

      finalMergeStream += 'q\n'
      finalMergeStream += '1 0 0 1 0 0 cm\n'
      finalMergeStream += `/${xnum} Do\n`
      finalMergeStream += 'Q\n'

      /* stream.content = stream.content.replace(/[0-9 ]+re\nf/, '')
      stream.content = `q\n1 0 0 1 0 0 cm\n/${xnum} Do\nQ\n` + stream.content
      stream.writeLine('')
      stream.object.prop('Filter', null) */
    })

    const pageStream = page.object.properties.get('Contents').object.content
    if (pageStream.object.properties.get('Filter')) {
      pageStream.content = zlib.unzipSync(pageStream.content).toString('ascii')
    } else {
      pageStream.content = uint8ToString(pageStream.content)
    }

    pageStream.content = pageStream.content.replace(/[0-9 ]+re\nf/, '')
    pageStream.content = finalMergeStream + pageStream.content
    pageStream.object.prop('Length', pageStream.content.length)
    pageStream.object.prop('Filter', null)
  }

  for (const i in pages) {
    addToPage(extContent.pages.get('Kids')[i], pages[i].buffers)
  }

  doc.addPagesOf(extContent)
  return doc.asBuffer()
}

/*
module.exports = (contentBuffer, headerBuffer, box, rotation, pageIndex, xObjIndex) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const doc = new pdfjs.Document({
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })
  const xobj = new EmbeddedPdf(headerBuffer, box)
  const headerStream = xobj.page.get('Contents').object.content
  headerStream.content = zlib.unzipSync(headerStream.content).toString('ascii')
  headerStream.content = headerStream.content.replace(/[0-9 ]+re\nf/, '')

  headerStream.object.prop('Length', headerStream.content.length)
  headerStream.object.prop('Filter', null)
  doc._doc._useXObject(xobj)

  function addToPage (page) {
    const xobjKey = Object.keys(doc._doc._xobjects).find((k) => doc._doc._xobjects[k].x === xobj)
    const resourcesOrRef = page.object.properties.get('Resources')
    const resources = resourcesOrRef.object ? resourcesOrRef.object.properties : resourcesOrRef

    const xnum = `X${xObjIndex}.0`
    if (resources.has('XObject')) {
      resources.get('XObject').add(xnum, doc._doc._xobjects[xobjKey].o[0].reference)
    } else {
      resources.set('XObject', new PDFDictionary({
        [xnum]: doc._doc._xobjects[xobjKey].o[0].reference
      }))
    }
    const stream = page.object.properties.get('Contents').object.content
    if (stream.object.properties.get('Filter')) {
      stream.content = zlib.unzipSync(stream.content).toString('ascii')
    } else {
      stream.content = uint8ToString(stream.content)
    }

    stream.content = 'q\n' + stream.content + '\nQ\n'
    stream.writeLine('q')
    stream.writeLine('1 0 0 1 0 0 cm')
    stream.writeLine(`/${xnum} Do`)
    stream.writeLine('Q')

    stream.object.prop('Filter', null)
  }

  addToPage(extContent.pages.get('Kids')[pageIndex])

  doc.addPagesOf(extContent)
  return doc.asBuffer()
}
*/
