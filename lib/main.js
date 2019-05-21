const path = require('path')
const scriptCallbackRender = require('./scriptCallbackRender')
const proxyPdfUtilsHandlers = require('./proxyPdfUtilsHandlers')
const cheerio = require('cheerio')

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfOperationType', {
    templateShortid: { type: 'Edm.String' },
    type: { type: 'Edm.String' },
    mergeToFront: { type: 'Edm.Boolean' },
    renderForEveryPage: { type: 'Edm.Boolean' },
    mergeWholeDocument: { type: 'Edm.Boolean' },
    enabled: { type: 'Edm.Boolean' }
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfOperations = { type: 'Collection(jsreport.PdfOperationType)' }
  }

  if (reporter.compilation) {
    reporter.compilation.include('scriptPdfProcessing', path.join(__dirname, 'scriptPdfProcessing.js'))
    reporter.compilation.include('proxyPdfUtilsMethods', path.join(__dirname, 'proxyPdfUtilsMethods.js'))
  }

  reporter.addRequestContextMetaConfig('pdfUtils', { sandboxHidden: true })

  reporter.afterTemplatingEnginesExecutedListeners.add('pdf-utils', (req, res) => {
    if (!res.content.includes('data-pdf-outline')) {
      // optimization, don't do parsing if there is not a single link enabled
      return
    }

    const $ = cheerio.load(res.content)
    const anchors = $('a[data-pdf-outline]')

    req.context.pdfUtilsOutlines = []

    anchors.each(function (i, a) {
      const href = $(this).attr('href')
      if (!href || href[0] !== '#') {
        throw reporter.createError('Invalid url passed to anchor href with data-pdf-outline attribute.', {
          statusCode: 400
        })
      }

      const title = $(this).attr('data-pdf-outline-title') || $(this).text().trim()

      if (!title) {
        throw reporter.createError('Invalid value passed to data-pdf-outline-title.', {
          statusCode: 400
        })
      }

      const parent = $(this).attr('data-pdf-outline-parent') || null

      if (parent && !req.context.pdfUtilsOutlines.find(o => o.id === parent)) {
        throw reporter.createError(`Outline parent "${parent}" passed to data-pdf-outline-parent was not found.`, {
          statusCode: 400
        })
      }

      req.context.pdfUtilsOutlines.push({
        id: href.substring(1),
        title,
        parent
      })
    })
  })

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

      if (groupId == null) {
        const err = new Error('"pdfCreatePagesGroup" was called with undefined parameter. One parameter was expected.')
        err.stack = null
        throw err
      }

      const jsonStrOriginalValue = JSON.stringify(groupId)
      const value = Buffer.from(jsonStrOriginalValue).toString('base64')
      // we use position: absolute to make the element to not participate in flexbox layout
      // (making it not a flexbox child)
      const result = `<span style='position:absolute;text-transform: none;opacity: 0.01;font-size:1.1px'>group@@@${value}@@@</span>`
      console.log(`Pdf utils adding group field, value: ${jsonStrOriginalValue}`)
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

      if (item == null) {
        const err = new Error('"pdfAddPageItem" was called with undefined parameter. One parameter was expected.')
        err.stack = null
        throw err
      }

      const jsonStrOriginalValue = JSON.stringify(item)
      const value = Buffer.from(jsonStrOriginalValue).toString('base64')
      // we use position: absolute to make the element to not participate in flexbox layout
      // (making it not a flexbox child)
      const result = `<span style='position:absolute;text-transform: none;opacity: 0.01;font-size:1.1px'>item@@@${value}@@@</span>`
      console.log(`Pdf utils adding item field, value: ${jsonStrOriginalValue}`)
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
    if ((!req.template.pdfOperations || req.template.pdfOperations.length === 0) && !req.context.pdfUtilsOutlines) {
      return
    }

    if (!req.template.recipe.includes('pdf')) {
      reporter.logger.debug('Skipping pdf utils operations because template is rendered with non-pdf recipe.', req)
      return
    }

    reporter.logger.info('pdf-utils is starting pdf processing', req)

    const result = await reporter.executeScript({
      pdfContent: res.content.toString('base64'),
      operations: req.template.pdfOperations || [],
      outlines: req.context.pdfUtilsOutlines
    }, {
      execModulePath: reporter.execution ? reporter.execution.resolve('scriptPdfProcessing') : path.join(__dirname, 'scriptPdfProcessing.js'),
      timeoutErrorMessage: 'Timeout during evaluation of pdf-utils operations',
      callback: (operationParams, cb) => scriptCallbackRender(reporter, req, operationParams, cb)
    }, req)

    if (result.logs) {
      result.logs.forEach((m) => {
        reporter.logger[m.level](m.message, { ...req, timestamp: m.timestamp })
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

  reporter.initializeListeners.add('pdf-utils', async (req, res) => {
    if (
      reporter.scripts &&
      reporter.scripts.addProxyMethods
    ) {
      const proxyPdfUtilsMethodsPath = reporter.execution ? (
        reporter.execution.resolve('proxyPdfUtilsMethods')
      ) : path.join(__dirname, 'proxyPdfUtilsMethods.js')

      reporter.scripts.addProxyMethods(proxyPdfUtilsMethodsPath, proxyPdfUtilsHandlers)
    }
  })
}
