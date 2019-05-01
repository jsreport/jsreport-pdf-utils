const PdfManipulator = require('./utils/pdfManipulator')

async function parse (reporter, originalReq, spec, cb) {
  try {
    const sourcePdfBuf = spec.data.sourcePdf
    const includeText = spec.data.includeText
    const manipulator = PdfManipulator(sourcePdfBuf)
    const parsedPdf = await manipulator.parse(includeText)

    cb(null, parsedPdf)
  } catch (e) {
    cb(e)
  }
}

async function prepend (reporter, originalReq, spec, cb) {
  try {
    const sourcePdfBuf = spec.data.sourcePdf
    const extraPdfBuf = spec.data.extraPdf
    const manipulator = PdfManipulator(sourcePdfBuf)

    await manipulator.prepend(extraPdfBuf)

    const resultPdfBuf = await manipulator.toBuffer()

    cb(null, resultPdfBuf)
  } catch (e) {
    cb(e)
  }
}

async function append (reporter, originalReq, spec, cb) {
  try {
    const sourcePdfBuf = spec.data.sourcePdf
    const extraPdfBuf = spec.data.extraPdf
    const manipulator = PdfManipulator(sourcePdfBuf)

    await manipulator.append(extraPdfBuf)

    const resultPdfBuf = await manipulator.toBuffer()

    cb(null, resultPdfBuf)
  } catch (e) {
    cb(e)
  }
}

async function merge (reporter, originalReq, spec, cb) {
  try {
    const sourcePdfBuf = spec.data.sourcePdf
    const extraPdfBufOrPages = spec.data.extraPdfOrPages
    const mergeToFront = spec.data.mergeToFront
    const manipulator = PdfManipulator(sourcePdfBuf)

    // merge needs to have information about total of pages in source pdf
    await manipulator.parse()

    await manipulator.merge(extraPdfBufOrPages, mergeToFront)

    const resultPdfBuf = await manipulator.toBuffer()

    cb(null, resultPdfBuf)
  } catch (e) {
    cb(e)
  }
}

async function outlines (reporter, originalReq, spec, cb) {
  try {
    const sourcePdfBuf = spec.data.sourcePdf
    const outlines = spec.data.outlines
    const manipulator = PdfManipulator(sourcePdfBuf)

    await manipulator.outlines(outlines)

    const resultPdfBuf = await manipulator.toBuffer()

    cb(null, resultPdfBuf)
  } catch (e) {
    cb(e)
  }
}

module.exports = (reporter) => ({
  'pdfUtils.parse': (...args) => parse(reporter, ...args),
  'pdfUtils.prepend': (...args) => prepend(reporter, ...args),
  'pdfUtils.append': (...args) => append(reporter, ...args),
  'pdfUtils.outlines': (...args) => outlines(reporter, ...args),
  'pdfUtils.merge': (...args) => merge(reporter, ...args)
})
