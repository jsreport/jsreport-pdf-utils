const JsReport = require('jsreport-core')
const Promise = require('bluebird')
const parsePdf = require('../lib/utils/parsePdf')
require('should')

describe('version control', () => {
  let jsreport

  beforeEach(async () => {
    jsreport = JsReport({ tasks: { strategy: 'in-process' } })
    jsreport.use(require('jsreport-templates')())
    jsreport.use(require('jsreport-chrome-pdf')())
    jsreport.use(require('jsreport-handlebars')())
    jsreport.use(require('../')())
    return jsreport.init()
  })

  it('should be able to merge in a header', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'header',
      shortid: 'header',
      engine: 'none',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: 'foo',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfUtils: {
          headerTemplateShortid: 'header',
          headerHeight: '10cm'
        }
      }
    })

    const parsedPdf = await parsePdf(result.content)
    parsedPdf.pages[0].Texts.find((t) => t.R[0].T === 'foo').should.be.ok()
    parsedPdf.pages[0].Texts.find((t) => t.R[0].T === 'header').should.be.ok()
  })

  it.only('should be able to merge header with pageCount', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{$pdf.pageNumber}}/{{$pdf.pages.length}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `<h1 style='page-break-before: always'>Hello</h1><h1 style='page-break-before: always'>Hello</h1>`,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfUtils: {
          headerTemplateShortid: 'header',
          headerHeight: '10cm'
        }
      }
    })

    const parsedPdf = await parsePdf(result.content)
    parsedPdf.pages[0].Texts.find((t) => t.R[0].T === '1/2').should.be.ok()
    parsedPdf.pages[2].Texts.find((t) => t.R[0].T === '2/2').should.be.ok()
  })
})
