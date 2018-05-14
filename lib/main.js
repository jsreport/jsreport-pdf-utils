const PdfManipulator = require('./utils/pdfManipulator')

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
      reporter.logger.debug('Skipping pdf utils operations because template is rendered with non-pdf recipe.')
      return
    }

    async function render (shortidOrTemplate, data = {}) {
      let templateToUse

      if (typeof shortidOrTemplate === 'string') {
        templateToUse = { shortid: shortidOrTemplate }
      } else {
        templateToUse = { ...shortidOrTemplate }
      }

      const result = await reporter.render({ template: templateToUse, data }, req)
      return result.content
    }

    const manipulator = PdfManipulator(res.content)
    for (const operation of req.template.pdfOperations.filter(o => o.templateShortid || o.template)) {
      await manipulator.parse()

      let templateDef

      if (operation.templateShortid) {
        templateDef = operation.templateShortid
      } else {
        templateDef = operation.template
      }

      reporter.logger.debug(`Running pdf operation ${operation.type}`, req)

      if (operation.type === 'append') {
        await manipulator.append(await render(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'prepend') {
        await manipulator.prepend(await render(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }))
        continue
      }

      if (operation.type === 'merge') {
        let singleMergeBuffer = !operation.renderForEveryPage
          ? await render(templateDef, { $pdf: { pages: manipulator.parsedPdf.pages } }) : null

        const pagesBuffers = []
        for (let i = 0; i < manipulator.parsedPdf.pages.length; i++) {
          if (!singleMergeBuffer && manipulator.parsedPdf.pages[i].group) {
            reporter.logger.debug('Pdf utils invokes merge with group ' + manipulator.parsedPdf.pages[i].group, req)
          }

          pagesBuffers[i] = singleMergeBuffer || await render(templateDef, {
            $pdf: { pages: manipulator.parsedPdf.pages,
              pageIndex: i,
              pageNumber: i + 1
            }
          })
        }

        await manipulator.merge(pagesBuffers, operation.mergeToFront)
        continue
      }
    }

    res.content = await manipulator.toBuffer()
  })
}
