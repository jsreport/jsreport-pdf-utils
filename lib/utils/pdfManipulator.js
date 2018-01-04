const mergePdfs = require('./mergePdfs')
const parsePdf = require('./parsePdf')
const addPages = require('./addPages')
const Promise = require('bluebird')

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

    async merge (pageBuffers, layer, removeContentBackLayer) {
      for (let i = 0; i < currentlyParsedPdf.pages.length; i++) {
        pagesHelpInfo[i] = pagesHelpInfo[i] || { xObjIndex: 0, removeContentBackLayer: removeContentBackLayer }
        pagesHelpInfo[i].xObjIndex++
      }

      currentBuffer = await mergePdfs(currentBuffer, pageBuffers, layer, pagesHelpInfo)
      pagesHelpInfo.forEach(i => (i.removeContentBackLayer = false))
    },

    toBuffer () {
      return Promise.resolve(currentBuffer)
    }
  }
}
