const mergePdfs = require('./utils/mergePdfs')
const parsePdf = require('./utils/parsePdf')
const extend = require('node.extend')

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfUtilsType', {
    headerTemplateShortid: {type: 'Edm.String'},
    headerHeight: {type: 'Edm.String'}
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfUtils = { type: 'jsreport.PdfUtilsType' }
  }

  reporter.afterRenderListeners.insert(0, 'pdf-utils', async (req, res) => {
    if (!req.template.pdfUtils) {
      return
    }

    if (req.template.pdfUtils.headerTemplateShortid) {
      const pdf = await parsePdf(res.content)

      for (let i = 0; i < pdf.pages.length; i++) {
        const _req = extend(true, {}, req)
        _req.template = { shortid: req.template.pdfUtils.headerTemplateShortid }
        _req.data = _req.data || {}
        _req.data.$pdf = {
          pages: pdf.pages,
          currentPage: pdf.pages[i],
          pageNumber: i + 1
        }
        _req.options.isChildRequest = true

        const resHeader = await req.reporter.render(_req)
        console.log('merging page ' + i)
        res.content = await mergePdfs(res.content, resHeader.content, req.template.pdfUtils.headerHeight)
      }
    }
  })
}
