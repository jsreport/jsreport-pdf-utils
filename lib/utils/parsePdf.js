const PDFParser = require('pdf2json')
const Promise = require('bluebird')

module.exports = (contentBuffer) => {
  const pdfParser = new PDFParser()
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err)
    })
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve({
        pages: pdfData.formImage.Pages.map((p) => ({
          // flatten all texts into a single array
          texts: p.Texts.reduce((a, t) => a.concat(t.R.map(r => decodeURIComponent(r.T))), [])
        }))
      })
    })

    pdfParser.parseBuffer(contentBuffer)
  })
}
