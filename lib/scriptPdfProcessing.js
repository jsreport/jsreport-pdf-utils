const util = require('util')
const PdfManipulator = require('./utils/pdfManipulator')

module.exports = async (inputs, callback, done) => {
  const callbackAsync = util.promisify(callback)
  const { pdfContent, operations } = inputs
  let logs = []

  const renderCallback = async (shortidOrTemplate, data) => {
    const renderContent = await callbackAsync({
      shortidOrTemplate,
      data,
      // we send current logs to callback to keep correct order of
      // logs in request, after the callback is done we empty the logs again
      // (since they were added in the callback code already)
      logs
    }).then((r) => {
      logs = []
      return r
    }).catch((e) => {
      logs = []
      throw e
    })

    return Buffer.from(renderContent, 'base64')
  }

  function log (level, ...args) {
    logs.push({
      timestamp: new Date().getTime(),
      level: level,
      message: util.format.apply(util, args)
    })
  }

  try {
    const pdfBuf = Buffer.from(pdfContent, 'base64')
    const manipulator = PdfManipulator(pdfBuf)
    const operationsToProcess = operations.filter(o => o.templateShortid || o.template)

    log('debug', `Detected ${operationsToProcess.length} pdf operation(s) to process`)

    for (const operation of operationsToProcess) {
      if (operation.enabled === false) {
        log('debug', `Skipping disabled pdf operation ${operation.type}`)
        continue
      }

      await manipulator.parse()

      let templateDef

      if (operation.templateShortid) {
        templateDef = operation.templateShortid
      } else {
        templateDef = operation.template
      }

      log('debug', `Running pdf operation ${operation.type}`)

      if (operation.type === 'append') {
        await manipulator.append(await renderCallback(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'prepend') {
        await manipulator.prepend(await renderCallback(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'merge') {
        if (operation.mergeWholeDocument) {
          const mergeBuffer = await renderCallback(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } })
          await manipulator.merge(mergeBuffer, operation.mergeToFront)
          continue
        }

        let singleMergeBuffer = !operation.renderForEveryPage
          ? await renderCallback(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }) : null

        const pagesBuffers = []

        for (let i = 0; i < manipulator.parsedPdf.pages.length; i++) {
          if (!singleMergeBuffer && manipulator.parsedPdf.pages[i].group) {
            log('debug', `Pdf utils invokes merge with group ${manipulator.parsedPdf.pages[i].group}`)
          }

          pagesBuffers[i] = singleMergeBuffer || await renderCallback(templateDef, {
            $pdf: {
              pages: manipulator.parsedPdf.pages,
              pageIndex: i,
              pageNumber: i + 1
            }
          })
        }

        await manipulator.merge(pagesBuffers, operation.mergeToFront)
        continue
      }
    }

    if (inputs.outlines) {
      log('debug', `Adding pdf outlines`)
      await manipulator.outlines(inputs.outlines)
    }

    const resultPdfBuffer = await manipulator.toBuffer()

    done(null, {
      logs,
      pdfContent: resultPdfBuffer.toString('base64')
    })
  } catch (e) {
    done(null, {
      logs,
      error: {
        message: e.message,
        stack: e.stack
      }
    })
  }
}
