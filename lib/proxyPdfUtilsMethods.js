
module.exports = (callbackAsync) => ({
  pdfUtils: {
    parse: (sourcePdfBuf, includeText) => callbackAsync({
      action: 'pdfUtils.parse',
      data: {
        sourcePdf: sourcePdfBuf,
        includeText
      }
    }),
    prepend: (sourcePdfBuf, extraPdfBuf) => callbackAsync({
      action: 'pdfUtils.prepend',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdf: extraPdfBuf
      }
    }),
    append: (sourcePdfBuf, extraPdfBuf) => callbackAsync({
      action: 'pdfUtils.append',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdf: extraPdfBuf
      }
    }),
    merge: (sourcePdfBuf, extraPdfBufOrPages, mergeToFront) => callbackAsync({
      action: 'pdfUtils.merge',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdfOrPages: extraPdfBufOrPages,
        mergeToFront
      }
    }),
    removePages: (sourcePdfBuf, pageNumbers) => callbackAsync({
      action: 'pdfUtils.removePages',
      data: {
        sourcePdf: sourcePdfBuf,
        pageNumbers
      }
    }),
    outlines: (sourcePdfBuf, outlines) => callbackAsync({
      action: 'pdfUtils.outlines',
      data: {
        sourcePdf: sourcePdfBuf,
        outlines
      }
    })
  }
})
