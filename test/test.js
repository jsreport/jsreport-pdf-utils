const JsReport = require('jsreport-core')
const parsePdf = require('../lib/utils/parsePdf')
const fs = require('fs')
const path = require('path')
const pdfjs = require('jsreport-pdfjs')
const { extractSignature } = require('node-signpdf/dist/helpers.js')
const should = require('should')

function initialize (strategy = 'in-process') {
  const jsreport = JsReport({
    encryption: {
      secretKey: '1111111811111118'
    },
    templatingEngines: { strategy }
  })

  jsreport.use(require('jsreport-templates')())
  jsreport.use(require('jsreport-chrome-pdf')({
    launchOptions: {
      args: ['--no-sandbox']
    }
  }))
  jsreport.use(require('jsreport-assets')())
  jsreport.use(require('jsreport-phantom-pdf')())
  jsreport.use(require('jsreport-handlebars')())
  jsreport.use(require('jsreport-jsrender')())
  jsreport.use(require('jsreport-scripts')())
  jsreport.use(require('../')())
  jsreport.use(require('jsreport-child-templates')())
  return jsreport.init()
}

describe('pdf utils', () => {
  let jsreport
  beforeEach(async () => (jsreport = await initialize()))
  afterEach(() => jsreport && jsreport.close())

  it('merge should embed static text', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      name: 'header',
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
        name: 'content',
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

  it('merge with renderForEveryPage flag should provide dynamic pageNumber for every page', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{$pdf.pageNumber}}/{{$pdf.pages.length}}',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `<h1 style='page-break-before: always'>Hello</h1><h1 style='page-break-before: always'>Hello</h1>`,
        engine: 'none',
        name: 'content',
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
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "SomeText"}}}`,
        engine: 'handlebars',
        name: 'content',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('SomeText').should.be.true()
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper and mark the last group on the same page', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group}}{{/with}}',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "SomeText"}}}{{{pdfCreatePagesGroup "Different"}}}`,
        engine: 'handlebars',
        name: 'content',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('Different').should.be.true()
  })

  it('merge with renderForEveryPage should be able to group multiple pages using single pdfCreatePagesGroup helper', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group}}{{/with}}',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `a{{{pdfCreatePagesGroup "1"}}}<div style='page-break-before: always' />b`,
        engine: 'handlebars',
        name: 'content',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.should.containEql('1')
    parsedPdf.pages[1].text.should.containEql('1b')
  })

  it('merge with renderForEveryPage should be able to use pdfCreatePagesGroup helper with hash params', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group.foo}}{{/with}}',
      shortid: 'header',
      name: 'header',
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
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      helpers: 'function test(v) { return typeof v }'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup num}}}`,
        engine: 'handlebars',
        name: 'content',
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

  it('should work with helpers in an object', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{test 1}}',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      helpers: {
        test: v => typeof v
      }
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup num}}}`,
        engine: 'handlebars',
        name: 'content',
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
      name: 'header',
      engine: 'jsrender',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{pdfCreatePagesGroup foo="1"/}}`,
        engine: 'jsrender',
        name: 'content',
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
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfAddPageItem "a"}}}{{{pdfAddPageItem "b"}}}`,
        name: 'content',
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('ab').should.be.true()
  })

  it('merge should work for multiple operations', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'header',
      name: 'header',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    await jsreport.documentStore.collection('templates').insert({
      content: 'footer',
      name: 'footer',
      shortid: 'footer',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `Foo`,
        name: 'content',
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
      name: 'header',
      shortid: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `Foo`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: false, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
    parsedPdf.pages[0].text.includes('Foo').should.be.ok()
  })

  it('merge with inline template definition', async () => {
    const result = await jsreport.render({
      template: {
        content: 'foo',
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', template: { content: 'header', engine: 'none', 'recipe': 'chrome-pdf' } }],
        chrome: {
          marginTop: '3cm'
        }
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('foo').should.be.ok()
    parsedPdf.pages[0].text.includes('header').should.be.ok()
  })

  it('append operation be able to append pages from another template', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'anotherpage',
      shortid: 'anotherPage',
      name: 'anotherPage',
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
        name: 'foo',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'append', templateShortid: 'anotherPage' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('foo').should.be.ok()
    parsedPdf.pages[1].text.includes('anotherpage').should.be.ok()
  })

  it('append with inline template definition', async () => {
    const result = await jsreport.render({
      template: {
        content: `foo`,
        engine: 'none',
        name: 'foo',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'append', template: { content: 'bar', engine: 'none', recipe: 'chrome-pdf' } }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('foo').should.be.ok()
    parsedPdf.pages[1].text.includes('bar').should.be.ok()
  })

  it('prepend operation be able to prepend pages from another template', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'anotherpage',
      shortid: 'anotherPage',
      name: 'anotherPage',
      engine: 'handlebars',
      recipe: 'chrome-pdf',
      chrome: {
        landscape: true
      }
    })

    const result = await jsreport.render({
      template: {
        content: `foo`,
        name: 'foo',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'prepend', templateShortid: 'anotherPage' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('anotherpage').should.be.ok()
    parsedPdf.pages[1].text.includes('foo').should.be.ok()
  })

  it('prepend with inline template definition', async () => {
    const result = await jsreport.render({
      template: {
        content: `foo`,
        name: 'foo',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'prepend', template: { content: 'bar', engine: 'none', recipe: 'chrome-pdf', chrome: { landscape: true } } }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.includes('bar').should.be.ok()
    parsedPdf.pages[1].text.includes('foo').should.be.ok()
  })

  it('merge should work for very long reports', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      name: 'header',
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
        name: 'content',
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

  it('operations should be skipped when rendering template with non pdf', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      name: 'header',
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
        name: 'content',
        engine: 'none',
        recipe: 'html',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }]
      }
    })

    result.content.toString().should.be.eql('foo')
  })

  it('should keep order of logs', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '<div style"height: 2cm">header</div>',
      shortid: 'header',
      name: 'header',
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
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }],
        chrome: {
          marginTop: '3cm'
        }
      }
    })

    const logs = result.meta.logs.map(m => m.message)
    const startingLogIndex = logs.indexOf('pdf-utils is starting pdf processing')

    startingLogIndex.should.be.not.eql(-1)

    const nextLog = logs[startingLogIndex + 1]

    nextLog.should.be.containEql('detected 1 pdf operation(s) to process')
  })

  it('should be able to ignore disabled operations', async () => {
    const result = await jsreport.render({
      template: {
        content: `
          world
        `,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        chrome: {
          marginTop: '2cm'
        },
        pdfOperations: [{
          type: 'merge',
          template: {
            content: `
              hello
            `,
            engine: 'none',
            recipe: 'chrome-pdf'
          },
          enabled: false
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(1)
    parsedPdf.pages[0].text.should.be.eql('world')
  })

  it('merge with renderForEveryPage should be able to use groups on previously appended report', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: '{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{group}}{{/with}}',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    await jsreport.documentStore.collection('templates').insert({
      content: `{{{pdfCreatePagesGroup "Appended"}}}`,
      shortid: 'append',
      name: 'append',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "Main"}}}`,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [ { type: 'append', templateShortid: 'append' },
          { type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.includes('Main').should.be.ok()
    parsedPdf.pages[1].text.includes('Appended').should.be.ok()
  })

  it('should be able to prepend none jsreport produced pdf', async () => {
    jsreport.afterRenderListeners.insert(0, 'test', (req, res) => {
      if (req.template.content === 'replace') {
        res.content = fs.readFileSync(path.join(__dirname, 'pdf-sample.pdf'))
      }
    })

    const result = await jsreport.render({
      template: {
        content: 'main',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'prepend',
          template: {
            content: 'replace',
            engine: 'none',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(2)
  })

  it('should be able to merge none jsreport produced pdf', async () => {
    jsreport.afterRenderListeners.insert(0, 'test', (req, res) => {
      if (req.template.content === 'replace') {
        res.content = fs.readFileSync(path.join(__dirname, 'pdf-sample.pdf'))
      }
    })

    const result = await jsreport.render({
      template: {
        content: 'main',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'merge',
          template: {
            content: 'replace',
            engine: 'none',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(1)
  })

  it('should be able to merge none jsreport produced pdf with multiple xobjs', async () => {
    jsreport.afterRenderListeners.insert(0, 'test', (req, res) => {
      if (req.template.content === 'replace') {
        res.content = fs.readFileSync(path.join(__dirname, 'multiple-embedded-xobj.pdf'))
      }
    })

    const result = await jsreport.render({
      template: {
        content: 'main',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'merge',
          template: {
            content: 'replace',
            engine: 'none',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(1)
  })

  it('merge should merge whole documents when mergeWholeDocument', async () => {
    const result = await jsreport.render({
      template: {
        content: `main1<div style='page-break-before: always;'></div>main2`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'merge',
          mergeWholeDocument: true,
          template: {
            content: `{{#each $pdf.pages}}
            <div>header</div>
            <div style='page-break-before: always;'></div>
          {{/each}}`,
            engine: 'handlebars',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(2)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
    parsedPdf.pages[1].text.includes('header').should.be.ok()
  })

  it('should be able to merge watermark into pdf with native header produced by phantomjs', async () => {
    const result = await jsreport.render({
      template: {
        content: `main`,
        name: 'content',
        engine: 'none',
        recipe: 'phantom-pdf',
        phantom: {
          header: 'header'
        },
        pdfOperations: [{
          type: 'merge',
          mergeWholeDocument: true,
          template: {
            content: `watermark`,
            engine: 'handlebars',
            recipe: 'phantom-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(1)
    parsedPdf.pages[0].text.includes('header').should.be.ok()
    parsedPdf.pages[0].text.includes('watermark').should.be.ok()
  })

  it('should add helpers if recipe is not pdf but there are pdf utils operations set', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: `
        Child {{{pdfAddPageItem "child"}}}
      `,
      name: 'child',
      engine: 'handlebars',
      recipe: 'html'
    })

    const result = await jsreport.render({
      template: {
        content: `
          Parent {{{pdfAddPageItem "parent"}}}
          {#child child}
        `,
        name: 'foo',
        engine: 'handlebars',
        recipe: 'html',
        pdfOperations: [{ type: 'merge', templateShortid: 'header' }]
      }
    })

    const resContent = result.content.toString()

    resContent.should.containEql('Parent <span')
    resContent.should.containEql('Child <span')
  })

  it('should add helpers even if there are no pdf utils operations set', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: `
        Child
        {{{pdfAddPageItem "child"}}}
      `,
      name: 'child',
      engine: 'handlebars',
      recipe: 'html'
    })

    const result = await jsreport.render({
      template: {
        content: `
          Parent
          {{{pdfAddPageItem "parent"}}}
          {#child child}
        `,
        name: 'content',
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: []
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages.should.have.length(1)
    parsedPdf.pages[0].items.includes('parent').should.be.ok()
    parsedPdf.pages[0].items.includes('child').should.be.ok()
  })

  // so far not supported
  it.skip('should work with appending weasyprint pdf twice', async () => {
    jsreport.afterRenderListeners.insert(0, 'test', (req, res) => {
      if (req.template.content === 'weasyprint') {
        res.content = fs.readFileSync(path.join(__dirname, 'weasyprint.pdf'))
      }
    })

    const result = await jsreport.render({
      template: {
        content: `main`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'append',
          template: {
            content: `weasyprint`,
            engine: 'handlebars',
            recipe: 'html'
          }
        }, {
          type: 'append',
          template: {
            content: `weasyprint`,
            engine: 'handlebars',
            recipe: 'html'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(3)
  })

  it('should work with merging word generated pdf and dont loose special characters', async () => {
    jsreport.afterRenderListeners.insert(0, 'test', (req, res) => {
      if (req.template.content === 'word') {
        res.content = fs.readFileSync(path.join(__dirname, 'word.pdf'))
      }
    })

    const result = await jsreport.render({
      template: {
        content: `main`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'merge',
          template: {
            content: `word`,
            engine: 'none',
            recipe: 'html'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(1)
    parsedPdf.pages[0].text.should.containEql('dénommé')
  })

  it('should not break pdf href links when doing append', async () => {
    const result = await jsreport.render({
      template: {
        content: `<a href='#foo'>foo</a><h1 id='foo'>hello</h1>`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'append',
          template: {
            content: `hello`,
            engine: 'none',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    result.content.toString().should.containEql('/Dests')
  })

  it('should not be affected by parent text-transform', async () => {
    const result = await jsreport.render({
      template: {
        content: `
          <div style="text-transform: uppercase">
            content
            {{{pdfAddPageItem text="testing text"}}}
          </div>
        `,
        name: 'content',
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        pdfOperations: [{
          type: 'merge',
          renderForEveryPage: true,
          template: {
            content: `{{#with (lookup $pdf.pages $pdf.pageIndex)}}{{items.[0].text}}{{/with}}`,
            engine: 'handlebars',
            recipe: 'chrome-pdf'
          }
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.should.containEql('testing text')
  })

  it('should be able to add outlines', async () => {
    const result = await jsreport.render({
      template: {
        content: ` <a href='#foo' data-pdf-outline data-pdf-outline-text='foo'>foo</a><h1 id='foo'>hello</h1>`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf'
      }
    })

    result.content.toString().should.containEql('/Outlines')
  })

  it('should be able to add outlines through child template', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: `<a href="#child" id="child" data-pdf-outline data-pdf-outline-parent="root">Child</a>`,
      name: 'child',
      engine: 'none',
      recipe: 'html'
    })
    const result = await jsreport.render({
      template: {
        content: `<a href="#root" id="root" data-pdf-outline>Root</a>{#child child}`,
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf'
      }
    })

    result.content.toString().should.containEql('/Outlines')
  })

  it('the hidden text for groups and items should be removed', async () => {
    await jsreport.documentStore.collection('templates').insert({
      content: 'header',
      shortid: 'header',
      name: 'header',
      engine: 'handlebars',
      recipe: 'chrome-pdf'
    })

    const result = await jsreport.render({
      template: {
        content: `{{{pdfCreatePagesGroup "SomeText"}}}{{{pdfAddPageItem "v"}}}`,
        engine: 'handlebars',
        name: 'content',
        recipe: 'chrome-pdf',
        pdfOperations: [{ type: 'merge', renderForEveryPage: true, templateShortid: 'header' }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages[0].text.should.not.containEql('group')
    parsedPdf.pages[0].text.should.not.containEql('item')
  })

  it('should expose jsreport-proxy pdfUtils (.parse)', async () => {
    const result = await jsreport.render({
      template: {
        content: 'empty',
        engine: 'none',
        recipe: 'html',
        scripts: [{
          content: `
            const jsreport = require('jsreport-proxy')

            async function afterRender (req, res) {
              const renderRes = await jsreport.render({
                template: {
                  content: 'foo',
                  engine: 'none',
                  recipe: 'chrome-pdf'
                }
              })

              const $pdf = await jsreport.pdfUtils.parse(renderRes.content, true)

              res.content = JSON.stringify($pdf)
            }
          `
        }]
      }
    })

    const $pdf = JSON.parse(result.content.toString())

    $pdf.pages.should.have.length(1)
    $pdf.pages[0].text.should.be.eql('foo')
  })

  it('should expose jsreport-proxy pdfUtils (.prepend)', async () => {
    const result = await jsreport.render({
      template: {
        content: 'First page',
        engine: 'none',
        recipe: 'chrome-pdf',
        scripts: [{
          content: `
            const jsreport = require('jsreport-proxy')

            async function afterRender (req, res) {
              const newRender = await jsreport.render({
                template: {
                  content: 'Cover page',
                  engine: 'none',
                  recipe: 'chrome-pdf'
                }
              })

              res.content = await jsreport.pdfUtils.prepend(res.content, newRender.content)
            }
          `
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages.should.have.length(2)
    parsedPdf.pages[0].text.includes('Cover').should.be.ok()
    parsedPdf.pages[1].text.includes('First').should.be.ok()
  })

  it('should expose jsreport-proxy pdfUtils (.append)', async () => {
    const result = await jsreport.render({
      template: {
        content: 'First page',
        engine: 'none',
        recipe: 'chrome-pdf',
        scripts: [{
          content: `
            const jsreport = require('jsreport-proxy')

            async function afterRender (req, res) {
              const newRender = await jsreport.render({
                template: {
                  content: 'Second page',
                  engine: 'none',
                  recipe: 'chrome-pdf'
                }
              })

              res.content = await jsreport.pdfUtils.append(res.content, newRender.content)
            }
          `
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages.should.have.length(2)
    parsedPdf.pages[0].text.includes('First').should.be.ok()
    parsedPdf.pages[1].text.includes('Second').should.be.ok()
  })

  it('should expose jsreport-proxy pdfUtils (.merge)', async () => {
    const result = await jsreport.render({
      template: {
        content: 'First page',
        engine: 'none',
        recipe: 'chrome-pdf',
        scripts: [{
          content: `
            const jsreport = require('jsreport-proxy')

            async function afterRender (req, res) {
              const newRender = await jsreport.render({
                template: {
                  content: '<div style="margin-top: 100px">Extra content</div>',
                  engine: 'none',
                  recipe: 'chrome-pdf'
                }
              })

              res.content = await jsreport.pdfUtils.merge(res.content, newRender.content)
            }
          `
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    parsedPdf.pages.should.have.length(1)
    parsedPdf.pages[0].text.includes('First').should.be.ok()
    parsedPdf.pages[0].text.includes('Extra').should.be.ok()
  })

  it('should expose jsreport-proxy pdfUtils (.outlines)', async () => {
    const result = await jsreport.render({
      template: {
        content: `
          <div>
            TOC
            <ul>
              <li>
                <a href='#first-section'>
                  First
                </a>
              </li>
              <li>
                <a href='#second-section'>
                  Second
                </a>
              </li>
            </ul>
          </div>
          <div style='page-break-before: always;'></div>
          <div style="height: 200px">
            <h1 id="first-section">First section</h1>
            <span>content</span>
          </div>
          <div style="height: 200px">
            <h1 id="second-section">Second section</h1>
            <span>content</span>
          </div>
        `,
        engine: 'none',
        recipe: 'chrome-pdf',
        scripts: [{
          content: `
            const jsreport = require('jsreport-proxy')

            async function afterRender (req, res) {
              res.content = await jsreport.pdfUtils.outlines(res.content, [{
                id: 'first-section',
                title: 'First section',
                parent: null
              }, {
                id: 'second-section',
                title: 'Second section',
                parent: null
              }])
            }
          `
        }]
      }
    })

    const parsedPdf = await parsePdf(result.content, true)

    result.content.toString().should.containEql('/Outlines')
    parsedPdf.pages.should.have.length(2)
    parsedPdf.pages[1].text.includes('First').should.be.ok()
    parsedPdf.pages[1].text.includes('Second').should.be.ok()
  })

  it('pdfPassword should encrypt output pdf', async () => {
    const result = await jsreport.render({
      template: {
        content: 'foo',
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfPassword: {
          password: 'password',
          printing: 'lowResolution',
          modifying: true,
          copying: true,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: true
        }
      }
    })

    const parsedPdf = await parsePdf(result.content, true, 'password')
    parsedPdf.pages[0].text.includes('foo').should.be.ok()
  })

  it('pdfMeta should add information to output pdf', async () => {
    const result = await jsreport.render({
      template: {
        content: 'foo',
        name: 'content',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfMeta: {
          title: 'Foo-title',
          author: 'Foo-author',
          subject: 'Foo-subject',
          keywords: 'Foo-keywords',
          creator: 'Foo-creator',
          producer: 'Foo-producer'
        }
      }
    })

    result.content.toString().should
      .containEql('Foo-title')
      .and.containEql('Foo-author')
      .and.containEql('Foo-subject')
      .and.containEql('Foo-keywords')
      .and.containEql('Foo-creator')
      .and.containEql('Foo-producer')
  })

  it('pdfSign should sign output pdf', async () => {
    const result = await jsreport.render({
      template: {
        content: 'Hello',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfSign: {
          certificateAsset: {
            content: fs.readFileSync(path.join(__dirname, 'certificate.p12')),
            password: 'node-signpdf'
          }
        }
      }
    })

    const { signature, signedData } = extractSignature(result.content)
    signature.should.be.of.type('string')
    signedData.should.be.instanceOf(Buffer)
  })

  it('pdfSign should be able to sign with reference to stored asset', async () => {
    await jsreport.documentStore.collection('assets').insert({
      name: 'certificate.p12',
      shortid: 'certificate',
      content: fs.readFileSync(path.join(__dirname, 'certificate.p12')),
      pdfSign: {
        passwordRaw: 'node-signpdf'
      }
    })

    const result = await jsreport.render({
      template: {
        content: 'Hello',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfSign: {
          certificateAssetShortid: 'certificate'
        }
      }
    })

    const { signature, signedData } = extractSignature(result.content)
    signature.should.be.of.type('string')
    signedData.should.be.instanceOf(Buffer)
  })

  it('pdfSign should crypt asset password before insert', async () => {
    const res = await jsreport.documentStore.collection('assets').insert({
      name: 'a',
      content: 'hello',
      engine: 'none',
      recipe: 'html',
      pdfSign: {
        passwordRaw: 'foo'
      }
    })

    should(res.pdfSign.passwordRaw).be.null()
    res.pdfSign.passwordSecure.should.not.be.eql('foo')
    res.pdfSign.passwordFilled.should.be.true()
  })

  it('pdfSign should crypt asset password before update', async () => {
    await jsreport.documentStore.collection('assets').insert({
      name: 'a',
      engine: 'none',
      recipe: 'html'
    })

    await jsreport.documentStore.collection('assets').update({ name: 'a' }, {
      $set: {
        pdfSign: {
          passwordRaw: 'foo'
        }
      }
    })

    const entity = await jsreport.documentStore.collection('assets').findOne({
      name: 'a'
    })

    should(entity.pdfSign.passwordRaw).be.null()
    entity.pdfSign.passwordSecure.should.not.be.eql('foo')
    entity.pdfSign.passwordFilled.should.be.true()
  })

  it('pdfSign should use asset encoding when inline in the request', async () => {
    const result = await jsreport.render({
      template: {
        content: 'Hello',
        engine: 'none',
        recipe: 'chrome-pdf',
        pdfSign: {
          certificateAsset: {
            content: fs.readFileSync(path.join(__dirname, 'certificate.p12')).toString('base64'),
            encoding: 'base64',
            password: 'node-signpdf'
          }
        }
      }
    })

    const { signature, signedData } = extractSignature(result.content)
    signature.should.be.of.type('string')
    signedData.should.be.instanceOf(Buffer)
  })

  it('pdfFormElement with text type', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `something before
        <span>
        {{{pdfFormElement fontFamily='Helvetica' readOnly=true backgroundColor='#00FF00' fontSize='12px' color='#FF0000' name='test' value='value' defaultValue='defaultValue' textAlign='right' type='text' width='100px' height='20px'}}}
        </span>
        and after`
      }
    })

    fs.writeFileSync('out.pdf', result.content)
    const doc = new pdfjs.ExternalDocument(result.content)

    const acroForm = doc.catalog.get('AcroForm').object
    should(acroForm).not.be.null()
    acroForm.properties.get('NeedAppearances').toString().should.be.eql('true')
    const fonts = acroForm.properties.get('DR').get('Font')

    should(doc.pages.get('Kids')[0].object.properties.get('Annots')[0].object).not.be.null()

    const field = acroForm.properties.get('Fields')[0].object
    field.properties.get('T').toString().should.be.eql('(test)')
    field.properties.get('FT').toString().should.be.eql('/Tx')
    field.properties.get('DV').toString().should.be.eql('(defaultValue)')
    field.properties.get('V').toString().should.be.eql('(value)')
    field.properties.get('Q').should.be.eql(2)// textAlign
    field.properties.get('Ff').should.be.eql(1)// read only flag
    field.properties.get('DA').toString().should.be.eql('(/Helvetica 12 Tf 1 0 0 rg)')
    field.properties.get('MK').get('BG').toString().should.be.eql('[0 1 0]')

    const da = field.properties.get('DA').toString()
    const fontRef = da.substring(1, da.length - 1).split(' ')[0]
    should(fonts.get(fontRef)).not.be.null()
    fonts.get(fontRef).object.properties.get('BaseFont').toString().should.be.eql('/Helvetica')
  })

  it('pdfFormElement with text type and format', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `{{{pdfFormElement format-type='number' format-nDec=2 format-sepComma=true format-getStyle='ParensRed' format-currency='$' format-currencyPrepend=true name='test' type='text' width='300px' height='20px'}}}`
      }
    })

    fs.writeFileSync('out.pdf', result.content)
    const doc = new pdfjs.ExternalDocument(result.content)

    const acroForm = doc.catalog.get('AcroForm').object
    const field = acroForm.properties.get('Fields')[0].object
    field.properties.get('AA').get('K').get('S').toString().should.be.eql('/JavaScript')
    field.properties.get('AA').get('K').get('JS').toString().should.be.eql('(AFNumber_Keystroke\\(2,0,"MinusBlack",null,"$",true\\);)')

    field.properties.get('AA').get('F').get('S').toString().should.be.eql('/JavaScript')
    field.properties.get('AA').get('F').get('JS').toString().should.be.eql('(AFNumber_Format\\(2,0,"MinusBlack",null,"$",true\\);)')
  })

  it('pdfFormElement test', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `{{{pdfFormElement format-type='date' format-param='dd.mm yyyy' name='test' type='text' width='300px' height='20px'}}}`
      }
    })

    fs.writeFileSync('out.pdf', result.content)
  })

  it('pdfFormElement with combo type', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `{{{pdfFormElement name='test' type='combo' value='b' items='a,b,c' width='100px' height='20px'}}}`
      }
    })

    const doc = new pdfjs.ExternalDocument(result.content)

    const acroForm = doc.catalog.get('AcroForm').object
    const field = acroForm.properties.get('Fields')[0].object

    field.properties.get('Ff').should.be.eql(131072)
    field.properties.get('FT').toString().should.be.eql('/Ch')
    field.properties.get('Opt').toString().should.be.eql('[(a) (b) (c)]')
  })

  it('pdfFormElement with submit/reset button', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `
          {{{pdfFormElement name='btn1' type='button' color='#FF0000' exportFormat=true url='http://myendpoint.com' action='submit' label='submit' width='200px' height='50px'}}}
          {{{pdfFormElement name='btn2' type='button' action='reset' label='reset' width='200px' height='50px'}}}
        `
      }
    })

    const doc = new pdfjs.ExternalDocument(result.content)
    fs.writeFileSync('out.pdf', result.content)

    const acroForm = doc.catalog.get('AcroForm').object

    const submitField = acroForm.properties.get('Fields')[0].object
    submitField.properties.get('FT').toString().should.be.eql('/Btn')
    submitField.properties.get('A').get('S').toString().should.be.eql('/SubmitForm')
    submitField.properties.get('A').get('F').toString().should.be.eql('(http://myendpoint.com)')
    submitField.properties.get('A').get('Type').toString().should.be.eql('/Action')
    submitField.properties.get('A').get('Flags').should.be.eql(4)
    submitField.properties.get('Ff').should.be.eql(65536)

    const resetField = acroForm.properties.get('Fields')[1].object
    resetField.properties.get('FT').toString().should.be.eql('/Btn')
    resetField.properties.get('A').get('S').toString().should.be.eql('/ResetForm')
    resetField.properties.get('A').get('Type').toString().should.be.eql('/Action')
  })

  it('pdfFormElement with custom font shouldnt other loose text', async () => {
    const result = await jsreport.render({
      template: {
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        content: `<html>
        <head>
            <style>
                @font-face {
                    font-family: 'Helvetica';
                    src: url(data:font/otf;base64,${fs.readFileSync(path.join(__dirname, 'Helvetica.otf')).toString('base64')});
                    format('woff');
                }
            </style>        
        </head>
        
        <body>
            <div style='font-family:Helvetica'>                 
                {{{pdfFormElement name='btn1' type='button' type='submit' width='200px' height='20px' label='foRm'}}}     
            </div>    
             <div>                 
                hello
            </div>    
        </body>
        
        </html>`
      }
    })

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages[0].text.should.containEql('hello')
  })
})

describe('pdf utils with http-server templating strategy', () => {
  let jsreport
  beforeEach(async () => (jsreport = await initialize('http-server')))
  afterEach(() => jsreport.close())

  it('should not fail when main and appended template has printBackground=true', async () => {
    const req = {
      template: {
        content: ' ',
        recipe: 'chrome-pdf',
        engine: 'handlebars',
        chrome: {
          printBackground: true
        },
        pdfOperations: [{
          type: 'append',
          template: {
            content: 'append',
            engine: 'handlebars',
            recipe: 'chrome-pdf',
            chrome: {
              printBackground: true
            }
          }
        }]
      }
    }

    const result = await jsreport.render(req)

    const parsedPdf = await parsePdf(result.content, true)
    parsedPdf.pages.should.have.length(2)
  })
})
