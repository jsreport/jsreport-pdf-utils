const pdfjs = require('pdfjs-dist')

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

async function getPageText (pageNum, doc) {
  const page = await doc.getPage(pageNum)
  const textContent = await page.getTextContent()
  return textContent.items.reduce((a, v) => a + v.str, '')
}

module.exports = async (contentBuffer, includeText = false) => {
  const doc = await pdfjs.getDocument(contentBuffer)
  let lastGroup

  const result = { pages: [] }
  for (let i = 1; i < doc.pdfInfo.numPages + 1; i++) {
    const text = await getPageText(i, doc)
    const page = {
      group: parseGroup(text) || lastGroup,
      items: parseItems(text)
    }
    lastGroup = page.group

    if (includeText) {
      page.text = text
    }

    result.pages.push(page)
  }

  return result
}
