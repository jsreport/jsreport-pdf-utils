const JsReport = require('jsreport-core')
require('should')

describe('version control', () => {
  let jsreport

  beforeEach(async () => {
    jsreport = JsReport()
    jsreport.use(require('jsreport-templates')())
    jsreport.use(require('jsreport-chrome-pdf')())
    jsreport.use(require('../')())
    return jsreport.init()
  })

  it('should render pdf', async () => {
    return jsreport.render({
      template: {
        content: 'foo',
        engine: 'none',
        recipe: 'chrome-pdf'
      }
    })
  })
})
