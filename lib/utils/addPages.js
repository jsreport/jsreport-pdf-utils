const pdfjs = require('pdfjs')

module.exports = (contentBuffer, headerBuffer) => {
  const extContent = new pdfjs.ExternalDocument(contentBuffer)
  const extHeader = new pdfjs.ExternalDocument(headerBuffer)
  const doc = new pdfjs.Document({
    font: new pdfjs.Font(require('pdfjs/font/helvetica.json'))
  })

  doc.addPagesOf(extContent)
  doc.addPagesOf(extHeader)
  return doc.asBuffer()
}

// vyzkouset jestli teda vubec potrebuju to pozicovani toho headeru/footeru, jestli to nemuzu dat na pozadi te stranky vzdycky
