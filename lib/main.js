const path = require('path')
const scriptCallbackRender = require('./scriptCallbackRender')

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfOperationType', {
    templateShortid: {type: 'Edm.String'},
    type: {type: 'Edm.String'},
    mergeToFront: {type: 'Edm.Boolean'},
    renderForEveryPage: {type: 'Edm.Boolean'}
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfOperations = { type: 'Collection(jsreport.PdfOperationType)' }
  }

  reporter.addRequestContextMetaConfig('pdfUtils', { sandboxHidden: true })

  reporter.beforeRenderListeners.insert({ after: 'data' }, 'pdf-utils', async (req, res) => {
    // we want to provide pdf utils helpers to all templates/child templates that are running in context of parent
    // template using pdf utils
    if ((!req.template.pdfOperations || req.template.pdfOperations.length === 0) && !req.context.pdfUtils) {
      return
    }

    req.context.pdfUtils = true

    function pdfCreatePagesGroup (groupId) {
      // handlebars
      if (groupId && groupId.hash) {
        groupId = groupId.hash
      }
      // jsrender
      if (this && this.tagCtx && this.tagCtx.props) {
        groupId = this.tagCtx.props
      }
      // otherwise just simple one value param is supported

      const value = Buffer.from(JSON.stringify(groupId)).toString('base64')
      const result = `<span style='opacity: 0.01;font-size:1.1px'>group@@@${value}@@@</span>`
      console.log('Pdf utils adding group hidden field ' + result)
      return result
    }

    function pdfAddPageItem (item) {
      // handlebars
      if (item && item.hash) {
        item = item.hash
      }
      // jsrender
      if (this && this.tagCtx && this.tagCtx.props) {
        item = this.tagCtx.props
      }
      // otherwise just simple one value param is supported

      const value = Buffer.from(JSON.stringify(item)).toString('base64')
      const result = `<span style='opacity: 0.01;font-size:1.1px'>item@@@${value}@@@</span>`
      console.log('Pdf utils adding item hidden field ' + result)
      return result
    }

    if (req.template.helpers && typeof req.template.helpers === 'object') {
      req.template.helpers.pdfCreatePagesGroup = pdfCreatePagesGroup
      req.template.helpers.pdfAddPageItem = pdfAddPageItem
    }

    req.template.helpers = pdfCreatePagesGroup + '\n' + pdfAddPageItem + '\n' + (req.template.helpers || '')
  })

  // we insert to the front so we can run before reports or scripts
  reporter.afterRenderListeners.insert(0, 'pdf-utils', async (req, res) => {
    if (!req.template.pdfOperations || req.template.pdfOperations.length === 0) {
      return
    }

    if (!req.template.recipe.includes('pdf')) {
      reporter.logger.debug('Skipping pdf utils operations because template is rendered with non-pdf recipe.', req)
      return
    }

    reporter.logger.info('pdf-utils is starting pdf processing', req)

    const result = await reporter.executeScript({
      pdfContent: res.content.toString('base64'),
      operations: req.template.pdfOperations
    }, {
      execModulePath: reporter.execution ? reporter.execution.resolve('scriptPdfProcessing.js') : path.join(__dirname, 'scriptPdfProcessing.js'),
      callback: (operationParams, cb) => scriptCallbackRender(reporter, req, operationParams, cb)
    }, req)

    if (result.logs) {
      result.logs.forEach((m) => {
        reporter.logger[m.level](m.message, {...req, timestamp: m.timestamp})
      })
    }

    if (result.error) {
      const error = new Error(result.error.message)
      error.stack = result.error.stack

      throw reporter.createError('Error while executing pdf-utils operations', {
        original: error,
        weak: true
      })
    }

    res.content = Buffer.from(result.pdfContent, 'base64')

    reporter.logger.info('pdf-utils pdf processing was finished', req)
  })
}
