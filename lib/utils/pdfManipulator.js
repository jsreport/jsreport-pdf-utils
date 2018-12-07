const mergePdfs = require('./mergePdfs')
const parsePdf = require('./parsePdf')
const addPages = require('./addPages')

module.exports = (contentBuffer) => {
  let currentBuffer = contentBuffer
  let currentlyParsedPdf
  let pagesHelpInfo = []

  return {
    async parse () {
      currentlyParsedPdf = await parsePdf(currentBuffer)
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

    toBuffer () {
      return Promise.resolve(currentBuffer)
    }
  }
}
