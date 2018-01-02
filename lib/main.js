const mergePdfs = require('./utils/mergePdfs')
const parsePdf = require('./utils/parsePdf')
const extend = require('node.extend')
const cssBoxToPdfBox = require('./cssBoxToPdfBox')
const addPages = require('./utils/addPages')

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfUtilsType', {
    headerTemplateShortid: {type: 'Edm.String'},
    headerBox: {type: 'Edm.String'},
    headerRotation: {type: 'Edm.String'},
    footerTemplateShortid: {type: 'Edm.String'},
    footerBox: {type: 'Edm.String'},
    appendTemplateShortid: {type: 'Edm.String'}
  })

  if (reporter.documentStore.model.entityTypes['TemplateType']) {
    reporter.documentStore.model.entityTypes['TemplateType'].pdfUtils = { type: 'jsreport.PdfUtilsType' }
  }

  reporter.afterRenderListeners.insert(0, 'pdf-utils', async (req, res) => {
    if (!req.template.pdfUtils) {
      return
    }

    if (req.template.pdfUtils.appendTemplateShortid) {
      const pdf = await parsePdf(res.content)
      const _req = extend(true, {}, req)
      _req.template = { shortid: req.template.pdfUtils.appendTemplateShortid }
      _req.data = _req.data || {}
      _req.data.$pdf = {
        pages: pdf.pages
      }

      _req.options.isChildRequest = true

      const resToAppend = await req.reporter.render(_req)
      res.content = await addPages(res.content, resToAppend.content)
    }

    if (req.template.pdfUtils.headerTemplateShortid || req.template.pdfUtils.footerTemplateShortid) {
      const pdf = await parsePdf(res.content)
      for (let i = 0; i < pdf.pages.length; i++) {
        const _req = extend(true, {}, req)
        _req.data = _req.data || {}
        _req.data.$pdf = {
          pages: pdf.pages,
          currentPage: pdf.pages[i],
          pageNumber: i + 1
        }

        _req.options.isChildRequest = true
        let xObjIndex = 1

        if (req.template.pdfUtils.headerTemplateShortid) {
          _req.template = { shortid: req.template.pdfUtils.headerTemplateShortid }
          const resHeader = await req.reporter.render(_req)
          res.content = await mergePdfs(res.content, resHeader.content, cssBoxToPdfBox(req.template.pdfUtils.headerBox), req.template.pdfUtils.headerRotation, i, xObjIndex++)
        }

        if (req.template.pdfUtils.footerTemplateShortid) {
          _req.template = { shortid: req.template.pdfUtils.footerTemplateShortid }
          const resFooter = await req.reporter.render(_req)
          res.content = await mergePdfs(res.content, resFooter.content, cssBoxToPdfBox(req.template.pdfUtils.footerBox), req.template.pdfUtils.headerRotation, i, xObjIndex)
        }
      }
    }
  })
}
