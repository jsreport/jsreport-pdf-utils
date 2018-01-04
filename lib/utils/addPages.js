const pdfjs = require('pdfjs')

module.exports = async (contentBuffer, appendBuffer) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const extAppend = new pdfjs.ExternalDocument(appendBuffer)
  const doc = new pdfjs.Document({
    // pdfjs requires some default font here, even it is not used later
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })

  doc.addPagesOf(extContent)
  doc.addPagesOf(extAppend)
  return {
    buffer: await doc.asBuffer(),
    pagesInContent: extContent.pageCount,
    pagesInAppend: extAppend.pageCount
  }
}
