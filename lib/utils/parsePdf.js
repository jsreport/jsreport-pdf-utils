const PDFParser = require('pdf2json')
const Promise = require('bluebird')

module.exports = (contentBuffer) => {
  const pdfParser = new PDFParser()
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve({ pages: pdfData.formImage.Pages })
    })

    pdfParser.parseBuffer(contentBuffer)
  })
}
