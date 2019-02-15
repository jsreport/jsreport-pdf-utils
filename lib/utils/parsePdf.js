const pdfjs = require('pdfjs-dist')

function parseGroup (text) {
  let value = null

  // we need to consider spaces in the string because in other OS the parsed text
  // can gives us string with space between the letters
  let regexp = /g[ ]?r[ ]?o[ ]?u[ ]?p[ ]?@[ ]?@[ ]?@([^@]*)@[ ]?@[ ]?@/gm
  let match = regexp.exec(text)

  while (match != null) {
    if (match.length < 1) {
      return value
    }

    if (match[1] != null && match[1] !== '') {
      const str = match[1].replace(/[ ]/g, '')
      value = JSON.parse(Buffer.from(str, 'base64').toString())
    }

    match = regexp.exec(text)
  }

  return value
}

function parseItems (text) {
  // we need to consider spaces in the string because in other OS the parsed text
  // can gives us string with space between the letters
  let regexp = /i[ ]?t[ ]?e[ ]?m[ ]?@[ ]?@[ ]?@([^@]*)@[ ]?@[ ]?@/g
  let match = regexp.exec(text)

  const items = []

  while (match != null) {
    if (match.length < 1) {
      return items
    }

    if (match[1] != null && match[1] !== '') {
      const str = match[1].replace(/[ ]/g, '')
      items.push(JSON.parse(Buffer.from(str, 'base64').toString()))
    }

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
      pages: [{
        items: []
      }]
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
