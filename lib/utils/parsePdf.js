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
  let doc
  try {
    doc = await pdfjs.getDocument(contentBuffer)
  } catch (e) {
    // pdf.js fails on empty pdfs even it is valid
    // seems better to just log warning than crash completely
    console.warn(`Failed to parse pdf. Items, groups and text isn't filled: ` + e)
    return {
      pages: {
        items: []
      }
    }
  }

  let lastGroup

  const result = { pages: [] }
  for (let i = 1; i < doc.pdfInfo.numPages + 1; i++) {
    const text = await getPageText(i, doc)
    const parsedGroup = parseGroup(text)
    const page = {
      group: parsedGroup == null ? lastGroup : parsedGroup,
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
