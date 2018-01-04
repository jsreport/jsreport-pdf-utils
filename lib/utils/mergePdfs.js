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

module.exports = (contentBuffer, pageBuffers, layer, pagesHelpInfo) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const doc = new pdfjs.Document({
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })

  for (const i in pageBuffers) {
    const page = extContent.pages.get('Kids')[i]

    // register the merged pdf as xobject into the new document represented in doc
    const xobj = new EmbeddedPdf(pageBuffers[i])
    const mergeStream = xobj.page.get('Contents').object.content
    mergeStream.content = zlib.unzipSync(mergeStream.content).toString('ascii')
    mergeStream.content = mergeStream.content.replace(/[0-9 ]+re\nf/, '')
    mergeStream.object.prop('Length', mergeStream.content.length)
    mergeStream.object.prop('Filter', null)
    doc._doc._useXObject(xobj)

    // add the xobject to the resources of the current page
    const xobjKey = Object.keys(doc._doc._xobjects).find((k) => doc._doc._xobjects[k].x === xobj)
    const resourcesOrRef = page.object.properties.get('Resources')
    const resources = resourcesOrRef.object ? resourcesOrRef.object.properties : resourcesOrRef
    // in case of multiple merged pdfs into the same page, we need to keep track of the xobject id in external pagesHelpInfo structure
    const xnum = `X${pagesHelpInfo[i].xObjIndex}.0`
    if (resources.has('XObject')) {
      resources.get('XObject').add(xnum, doc._doc._xobjects[xobjKey].o[0].reference)
    } else {
      resources.set('XObject', new PDFDictionary({
        [xnum]: doc._doc._xobjects[xobjKey].o[0].reference
      }))
    }

    // prepare the content instructions stream from the current page
    const pageStream = page.object.properties.get('Contents').object.content
    if (pageStream.object.properties.get('Filter')) {
      pageStream.content = zlib.unzipSync(pageStream.content).toString('ascii')
    } else {
      pageStream.content = uint8ToString(pageStream.content)
    }

    if (pagesHelpInfo[i].removeContentBackLayer) {
      // the back layer produced for example by chrome covers whole page with white rectangle
      // it is usually required to remove it to be able to put on behind headers/footers/watermarks
      pageStream.content = pageStream.content.replace(/[0-9 ]+re\nf/, '')
    }
    // the content stream typicaly modifies matrix and cursor during painting
    // we use "q" instruction to store the original state and "Q" to pop it back
    pageStream.content = '\nq\n' + pageStream.content + '\nQ\n'

    // change matrix position to the (0,0) and paint the xobject represented through EmbeddedPdf
    const embeddingCode = `q\n1 0 0 1 0 0 cm\n/${xnum} Do\nQ\n`
    if (layer === 'back') {
      pageStream.content = embeddingCode + pageStream.content
    } else {
      pageStream.content += embeddingCode
    }

    pageStream.object.prop('Length', pageStream.content.length)
    // TODO zip the stream instead to make the output pdf smaller
    pageStream.object.prop('Filter', null)
  }

  doc.addPagesOf(extContent)
  return doc.asBuffer()
}
