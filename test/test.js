const JsReport = require('jsreport-core')
const parsePdf = require('../lib/utils/parsePdf')
require('should')

describe('pdf utils', () => {
  let jsreport

  beforeEach(async () => {
    jsreport = JsReport({ tasks: { strategy: 'in-process' } })
    jsreport.use(require('jsreport-templates')())
    jsreport.use(require('jsreport-chrome-pdf')({
      launchOptions: {
        args: ['--no-sandbox']
      }
    }))
    jsreport.use(require('jsreport-handlebars')())
    jsreport.use(require('jsreport-jsrender')())
    jsreport.use(require('../')())
    return jsreport.init()
  })

  it('merge should embed static text', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      engine: 'none',
      chrome: {
        width: '8cm',
        height: '8cm'
      },
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: 'foo',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }],
        chrome: {
          marginTop: '3cm'
        }
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('foo').should.be.ok()
    parsedPdf.pages[0].text.includes('header').should.be.ok()
  })

  it('merge with renderForEveryPage flag should provide dynamic pageNumber for evrey page', async () => {
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
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('1/2').should.be.ok()
    parsedPdf.pages[1].text.includes('2/2').should.be.ok()
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group}}{{/with}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "Some Text"}}}`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].group.should.be.eql('Some Text')
    parsedPdf.pages[0].text.includes('Some Text').should.be.true()
  })

  it('merge with renderForEveryPage should be able to group multiple pages using single pdfCreatePagesGroup helper', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group}}{{/with}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "1"}}}<div style='page-break-before: always'>hello</div>`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].group.should.be.eql('1')
    parsedPdf.pages[1].group.should.be.eql('1')
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper with hash params', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group.foo}}{{/with}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup foo="1"}}}`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('1').should.be.ok()
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper and keep number type', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{test group}}{{/with}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      helpers: 'function test(v) { return typeof v }'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup num}}}`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      },
      data: {
        num: 1
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('number').should.be.ok()
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper with hash params with jsrender', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{:$pdf.pages[$pdf.pageIndex].group.foo}}',
      shortid: 'header',
      engine: 'jsrender',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{pdfCreatePagesGroup foo="1"/}}`,
        engine: 'jsrender',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('1').should.be.ok()
  })

  it('merge with renderForEveryPage should be able to use multiple pdfAddPageItem helper', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{items.[0]}}{{items.[1]}}{{/with}}',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfAddPageItem "a"}}}{{{pdfAddPageItem "b"}}}`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].items.should.have.length(2)
    parsedPdf.pages[0].items[0].should.be.eql('a')
    parsedPdf.pages[0].items[1].should.be.eql('b')
    parsedPdf.pages[0].text.includes('ab').should.be.true()
  })

  it('merge should work for multiple operations', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'header',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    await jsreport.documentStore.collection('templates').insert({
      content: 'footer',
      shortid: 'footer',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `Foo`,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }, { type: 'merge', templateShortid: 'footer' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
    parsedPdf.pages[0].text.includes('footer').should.be.ok()
  })

  it('merge with renderForEveryPage disabled should add static content', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'header',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `Foo`,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: false, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
    parsedPdf.pages[0].text.includes('Foo').should.be.ok()
  })

  it('append operation be able to append pages from another template', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'another page',
      shortid: 'anotherPage',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      chrome: {
        landscape: true
      }
    })

    const result = await jsreport.render({
      template: {
        content: `foo`,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'append', templateShortid: 'anotherPage' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('foo').should.be.ok()
    parsedPdf.pages[1].text.includes('another page').should.be.ok()
  })

  it('prepend operation be able to prepend pages from another template', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'another page',
      shortid: 'anotherPage',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      chrome: {
        landscape: true
      }
    })

    const result = await jsreport.render({
      template: {
        content: `foo`,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'prepend', templateShortid: 'anotherPage' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('another page').should.be.ok()
    parsedPdf.pages[1].text.includes('foo').should.be.ok()
  })

  it('merge should work for very long reports', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      engine: 'none',
      recipe: 'chrome-pdf'
    })

    let content = 'very long contentvery long content</br>'
    for (let i = 0; i < 5000; i++) {
      content += 'very long contentvery long content</br>'
    }

    const result = await jsreport.render({
      template: {
        content: content,
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }],
        chrome: {
          marginTop: '3cm'
        }
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
  })
})
