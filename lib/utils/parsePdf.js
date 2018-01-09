const PDFParser = require('pdf2json')
const Promise = require('bluebird')

function parseGroup (text) {
  const match = /group@@@(.*)@@@/.exec(text)
  if (!match || match.length < 1) {
    return null
  }

  const value = match[1]
  return JSON.parse(Buffer.from(value, 'base64').toString())
}

function parseItems (text) {
  let regexp = /item@@@([^@@@]*)@@@/g
  let match = regexp.exec(text)

  const items = []
  while (match != null) {
    items.push(JSON.parse(Buffer.from(match[1], 'base64').toString()))
    match = regexp.exec(text)
  }

  return items
}

module.exports = (contentBuffer, includeText = false) => {
  const pdfParser = new PDFParser()
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err)
    })
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const texts = pdfData.formImage.Pages.map((p) => p.Texts.reduce((a, t) => a.concat(t.R.map(r => decodeURIComponent(r.T))), []).join(''))
      let lastGroup
      const pages = texts.map((t) => {
        const page = {
          group: parseGroup(t) || lastGroup,
          items: parseItems(t)
        }
        lastGroup = page.group

        if (includeText) {
          page.text = t
        }

        return page
      })

      resolve({pages})
    })

    pdfParser.parseBuffer(contentBuffer)
  })
}
