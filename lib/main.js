const extend = require('node.extend')
const PdfManipulator = require('./utils/pdfManipulator')
const path = require('path')

function boolOrUndefined (par) {
  return (par === true || par === 'true') ? true : undefined
}

module.exports = (reporter, definition) => {
  reporter.options.tasks.modules.push({
    alias: 'toBase64.js',
    path: path.join(__dirname, 'toBase64.js')
  })

  reporter.documentStore.registerComplexType('PdfOperationType', {
    templateShortid: {type: 'Edm.String'},
    type: {type: 'Edm.String'},
    mergeToFront: {type: 'Edm.Boolean'},
    renderForEveryPage: {type: 'Edm.Boolean'}
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfOperations = { type: 'Collection(jsreport.PdfOperationType)' }
  }

  reporter.beforeRenderListeners.insert({ after: 'data' }, 'pdf-utils', async (req, res) => {
    if (!req.template.pdfOperations || req.template.pdfOperations.length === 0) {
      return
    }

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

      const toBase64 = require('toBase64.js')
      const value = toBase64(JSON.stringify(groupId))
      const result = `<span style='opacity: 0.01;font-size:1px'>group@@@${value}@@@</span>`
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

      const toBase64 = require('toBase64.js')
      const value = toBase64(JSON.stringify(item))
      const result = `<span style='opacity: 0.01;font-size:1px'>item@@@${value}@@@</span>`
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

    async function render (shortid, data = {}) {
      const _req = extend(true, {}, req)
      _req.template = { shortid }
      _req.data = _req.data || {}
      Object.assign(_req.data, data)
      _req.options.isChildRequest = true

      const result = await reporter.render(_req)
      return result.content
    }

    const manipulator = PdfManipulator(res.content)
    for (const operation of req.template.pdfOperations.filter(o => o.templateShortid)) {
      await manipulator.parse()
      req.logger.debug(`Running pdf operation ${operation.type}`)

      if (operation.type === 'append') {
        await manipulator.append(await render(operation.templateShortid, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'prepend') {
        await manipulator.prepend(await render(operation.templateShortid, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'merge') {
        let singleMergeBuffer = !boolOrUndefined(operation.renderForEveryPage)
          ? await render(operation.templateShortid, { $pdf: { pages: manipulator.parsedPdf.pages } }) : null

        const pagesBuffers = []
        for (let i = 0; i < manipulator.parsedPdf.pages.length; i++) {
          if (!singleMergeBuffer && manipulator.parsedPdf.pages[i].group) {
            req.logger.debug('Pdf utils invokes merge with group ' + manipulator.parsedPdf.pages[i].group)
          }

          pagesBuffers[i] = singleMergeBuffer || await render(operation.templateShortid, {
            $pdf: { pages: manipulator.parsedPdf.pages,
              pageIndex: i,
              pageNumber: i + 1
            }
          })
        }

        await manipulator.merge(pagesBuffers, boolOrUndefined(operation.mergeToFront))
        continue
      }
    }

    res.content = await manipulator.toBuffer()
  })
}
