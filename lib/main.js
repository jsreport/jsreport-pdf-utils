const mergePdfs = require('./utils/mergePdfs')
const parsePdf = require('./utils/parsePdf')
const extend = require('node.extend')
const addPages = require('./utils/addPages')

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfOperationType', {
    templateShortid: {type: 'Edm.String'},
    type: {type: 'Edm.String'}
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfOperations = { type: 'Collection(jsreport.PdfOperationType)' }
  }

  reporter.afterRenderListeners.insert(0, 'pdf-utils', async (req, res) => {
    if (!req.template.pdfOperations) {
      return
    }

    async function render (shortid, data = {}) {
      const _req = extend(true, {}, req)
      _req.template = { shortid }
      _req.data = _req.data || {}
      Object.assign(_req.data, data)
      _req.options.isChildRequest = true

      const result = await req.reporter.render(_req)
      return result.content
    }

    const mergesForPages = []
    const pdf = await parsePdf(res.content)

    for (const operation of req.template.pdfOperations) {
      req.logger.debug(`Running pdf operation ${operation.type}`)

      if (operation.type === 'renderAndAppend') {
        res.content = await addPages(res.content, await render(operation.templateShortid))
        continue
      }

      if (operation.type === 'renderAndPrepend') {
        res.content = await addPages(await render(operation.templateShortid), res.content)
        continue
      }

      if (operation.type === 'renderForEveryPageAndMerge') {
        for (let i = 0; i < pdf.pages.length; i++) {
          mergesForPages[i] = mergesForPages[i] || { buffers: [] }

          mergesForPages[i].buffers.push(await render(operation.templateShortid, {
            $pdf: { pages: pdf.pages,
              currentPage: pdf.pages[i],
              pageNumber: i + 1
            }
          }))
        }
      }

      if (operation.type === 'renderOnceAndMergeToEveryPage') {
        const resBuffer = await render(operation.templateShortid, {
          $pdf: { pages: pdf.pages }
        })
        for (let i = 0; i < pdf.pages.length; i++) {
          mergesForPages[i] = mergesForPages[i] || { buffers: [] }
          mergesForPages[i].buffers.push(resBuffer)
        }
      }
    }

    res.content = await mergePdfs(res.content, mergesForPages)
  })
}
