
module.exports = (callbackAsync, { parseBuffers }) => ({
  pdfUtils: {
    parse: (sourcePdfBuf, includeText) => callbackAsync({
      action: 'pdfUtils.parse',
      data: {
        sourcePdf: sourcePdfBuf,
        includeText
      }
    }).then(parseBuffers),
    prepend: (sourcePdfBuf, extraPdfBuf) => callbackAsync({
      action: 'pdfUtils.prepend',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdf: extraPdfBuf
      }
    }).then(parseBuffers),
    append: (sourcePdfBuf, extraPdfBuf) => callbackAsync({
      action: 'pdfUtils.append',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdf: extraPdfBuf
      }
    }).then(parseBuffers),
    merge: (sourcePdfBuf, extraPdfBufOrPages, mergeToFront) => callbackAsync({
      action: 'pdfUtils.merge',
      data: {
        sourcePdf: sourcePdfBuf,
        extraPdfOrPages: extraPdfBufOrPages,
        mergeToFront
      }
    }).then(parseBuffers),
    outlines: (sourcePdfBuf, outlines) => callbackAsync({
      action: 'pdfUtils.outlines',
      data: {
        sourcePdf: sourcePdfBuf,
        outlines
      }
    }).then(parseBuffers)
  }
})
