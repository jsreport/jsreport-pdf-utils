const pdfjs = require('pdfjs')
const PDFDictionary = require('pdfjs/lib/object/dictionary')
const zlib = require('zlib')
const EmbeddedPdf = require('./EmbeddedPdf')

module.exports = (contentBuffer, headerBuffer, height) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const doc = new pdfjs.Document({
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })
  const xobj = new EmbeddedPdf(headerBuffer, height)
  const headerStream = xobj.page.get('Contents').object.content
  headerStream.content = zlib.unzipSync(headerStream.content).toString('ascii')
  headerStream.object.prop('Length', headerStream.content.length)
  headerStream.object.prop('Filter', null)
  doc._doc._useXObject(xobj)

  function addToPage (page) {
    const xobjKey = Object.keys(doc._doc._xobjects).find((k) => doc._doc._xobjects[k].x === xobj)
    const resourcesOrRef = page.object.properties.get('Resources')
    const resources = resourcesOrRef.object ? resourcesOrRef.object.properties : resourcesOrRef
    if (resources.has('XObject')) {
      resources.get('XObject').add('X1.0', doc._doc._xobjects[xobjKey].o[0].reference)
    } else {
      resources.set('XObject', new PDFDictionary({
        'X1.0': doc._doc._xobjects[xobjKey].o[0].reference
      }))
    }
    const stream = page.object.properties.get('Contents').object.content
    stream.content = zlib.unzipSync(stream.content).toString('ascii')
    stream.content = 'q\n' + stream.content + '\nQ\n'
    stream.writeLine('q')
    stream.writeLine('1 0 0 1 0 0 cm')
    stream.writeLine('/X1.0 Do')
    stream.writeLine('Q')
    stream.object.prop('Filter', null)
  }

  extContent.pages.get('Kids').forEach((p) => addToPage(p))

  doc.addPagesOf(extContent)
  return doc.asBuffer()
}
