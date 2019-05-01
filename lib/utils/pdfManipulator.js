const mergePdfs = require('./mergePdfs')
const parsePdf = require('./parsePdf')
const addPages = require('./addPages')
const pdfjs = require('jsreport-pdfjs')

module.exports = (contentBuffer) => {
  let currentBuffer = contentBuffer
  let currentlyParsedPdf
  let pagesHelpInfo = []

  return {
    async parse (includeText = false) {
      currentlyParsedPdf = await parsePdf(currentBuffer, includeText)
      return currentlyParsedPdf
    },

    get parsedPdf () {
      return currentlyParsedPdf
    },

    async append (appendBuffer) {
      const addPageResult = await addPages(currentBuffer, appendBuffer)
      currentBuffer = addPageResult.buffer
    },

    async prepend (prependBuffer) {
      const addPageResult = await addPages(prependBuffer, currentBuffer)
      currentBuffer = addPageResult.buffer
      pagesHelpInfo = new Array(addPageResult.pagesInAppend).concat(pagesHelpInfo)
      currentBuffer = addPageResult.buffer
    },

    async merge (pageBuffersOrDocBuffer, mergeToFront) {
      for (let i = 0; i < currentlyParsedPdf.pages.length; i++) {
        pagesHelpInfo[i] = pagesHelpInfo[i] || { xObjIndex: 0, removeContentBackLayer: true }
        pagesHelpInfo[i].xObjIndex++
      }

      if (Buffer.isBuffer(pageBuffersOrDocBuffer)) {
        currentBuffer = await mergePdfs.mergeDocument(currentBuffer, pageBuffersOrDocBuffer, mergeToFront, pagesHelpInfo)
      } else {
        currentBuffer = await mergePdfs.mergePages(currentBuffer, pageBuffersOrDocBuffer, mergeToFront, pagesHelpInfo)
      }

      pagesHelpInfo.forEach(i => (i.removeContentBackLayer = false))
    },

    async outlines (outlines) {
      const ext = new pdfjs.ExternalDocument(currentBuffer)
      const doc = new pdfjs.Document()

      doc.addPagesOf(ext)
      for (const o of outlines) {
        doc.outline(o.title, o.id, o.parent)
      }

      currentBuffer = await doc.asBuffer()
    },

    toBuffer () {
      return Promise.resolve(currentBuffer)
    }
  }
}
