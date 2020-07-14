const path = require('path')
const cheerio = require('cheerio')

const missingSecretMessage = 'pdf-sign extension uses encryption to store sensitive data and needs secret key to be defined. Please fill "encryption.secretKey" at the root of the config or disable encryption using "encryption.enabled=false".'

module.exports = (reporter, definition) => {
  reporter.documentStore.registerComplexType('PdfOperationType', {
    templateShortid: { type: 'Edm.String' },
    type: { type: 'Edm.String' },
    mergeToFront: { type: 'Edm.Boolean' },
    renderForEveryPage: { type: 'Edm.Boolean' },
    mergeWholeDocument: { type: 'Edm.Boolean' },
    enabled: { type: 'Edm.Boolean' }
  })

  reporter.documentStore.registerComplexType('PdfMetaType', {
    title: { type: 'Edm.String' },
    author: { type: 'Edm.String' },
    subject: { type: 'Edm.String' },
    keywords: { type: 'Edm.String' },
    creator: { type: 'Edm.String' },
    producer: { type: 'Edm.String' }
  })

  reporter.documentStore.registerComplexType('PdfPasswordType', {
    password: { type: 'Edm.String' },
    ownerPassword: { type: 'Edm.String' },
    printing: { type: 'Edm.String', schema: { type: 'null' } },
    modifying: { type: 'Edm.Boolean' },
    copying: { type: 'Edm.Boolean' },
    annotating: { type: 'Edm.Boolean' },
    fillingForms: { type: 'Edm.Boolean' },
    contentAccessibility: { type: 'Edm.Boolean' },
    documentAssembly: { type: 'Edm.Boolean' }
  })

  reporter.documentStore.registerComplexType('PdfSignTemplateType', {
    certificateAssetShortid: { type: 'Edm.String', schema: { type: 'null' } },
    reason: { type: 'Edm.String' }
  })

  if (reporter.compilation) {
    reporter.compilation.resource('pdfjs-dist-lib-files', path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'lib'))
    reporter.compilation.resource('pdfjs-dist-external-files', path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'external'))
  }

  if (reporter.documentStore.model.entityTypes.TemplateType) {
    reporter.documentStore.model.entityTypes.TemplateType.pdfOperations = { type: 'Collection(jsreport.PdfOperationType)' }
    reporter.documentStore.model.entityTypes.TemplateType.pdfMeta = { type: 'jsreport.PdfMetaType', schema: { type: 'null' } }
    reporter.documentStore.model.entityTypes.TemplateType.pdfPassword = { type: 'jsreport.PdfPasswordType', schema: { type: 'null' } }
    reporter.documentStore.model.entityTypes.TemplateType.pdfSign = { type: 'jsreport.PdfSignTemplateType', schema: { type: 'null' } }
  }

  reporter.documentStore.on('before-init', () => {
    if (reporter.documentStore.model.entityTypes['AssetType']) {
      reporter.documentStore.registerComplexType('PdfSignAssetType', {
        passwordRaw: { type: 'Edm.String', visible: false },
        passwordSecure: { type: 'Edm.String', encrypted: true, visible: false },
        passwordFilled: { type: 'Edm.Boolean' }
      })

      reporter.documentStore.model.entityTypes['AssetType'].pdfSign = { type: 'jsreport.PdfSignAssetType' }
    }
  })

  reporter.addRequestContextMetaConfig('pdfUtils', { sandboxHidden: true })

  reporter.afterTemplatingEnginesExecutedListeners.add('pdf-utils', (req, res) => {
    // https://forum.jsreport.net/topic/1284/pdf-outline-with-child-templates
    if (!req.template.recipe.includes('pdf')) {
      // this skips also the child templates, because we want to get the outlines from final html
      return
    }

    if (res.content.includes('form@@@')) {
      req.context.pdfUtilsForms = true
    }

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

      const title =
        $(this).attr('data-pdf-outline-title') ||
        $(this)
          .text()
          .trim()

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
    // avoid helpers duplication
    if (typeof req.template.helpers === 'object') {
      if (req.template.helpers.pdfAddPageItem) {
        return
      }
    } else {
      if (req.template.helpers && req.template.helpers.includes('function pdfAddPageItem')) {
        return
      }
    }

    function pdfFormField (el) {
      // handlebars
      if (el && el.hash) {
        el = el.hash
      }
      // jsrender
      if (this && this.tagCtx && this.tagCtx.props) {
        el = this.tagCtx.props
      }

      if (el == null || el.type == null || el.name == null || el.width == null || el.height == null) {
        throw new Error('pdfFormField requires name, type, width, height params ')
      }

      if (!el.width.includes('px')) {
        throw new Error('pdfFormField width should be in px')
      }

      el.width = parseInt(el.width.substring(0, el.width.length - 2))

      if (!el.height.includes('px')) {
        throw new Error('pdfFormField height should be in px')
      }

      el.height = parseInt(el.height.substring(0, el.height.length - 2))

      if (el.fontSize != null) {
        if (!el.fontSize.includes('px')) {
          throw new Error('pdfFormField fontSize should be in px')
        }

        el.fontSize = parseInt(el.fontSize.substring(0, el.fontSize.length - 2))
      }

      if (el.items && typeof el.items === 'string') {
        el.items = el.items.split(',')
      }

      if (el.type === 'combo' && el.items == null) {
        throw new Error('pdfFormField with combo type needs requires items attribute')
      }

      if (el.fontFamily != null) {
        const stdFonts = ['Times-Roman', 'Times-Bold', 'Time-Italic', 'Time-BoldItalic', 'Courier', 'Courier-Bold', 'Courier-Oblique', 'Helvetica', 'Helvetica-Bold',
          'Helvetica-Oblique', 'Helvetica-BoldOblique', 'Symbol', 'ZapfDingbats', 'Courier-BoldOblique']

        if (!stdFonts.includes(el.fontFamily)) {
          throw new Error('pdfFormField supports only pdf base 14 fonts in fontFamily attribute.')
        }
      }

      const params = JSON.stringify(el)
      const value = Buffer.from(params).toString('base64')

      return `<span style='display: inline-block;vertical-align:middle;font-size:1.1px;width: ${el.width}px; height: ${el.height}px'>form@@@${value}@@@</span>`
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

      if (groupId == null) {
        const err = new Error('"pdfCreatePagesGroup" was called with undefined parameter. One parameter was expected.')
        err.stack = null
        throw err
      }

      const jsonStrOriginalValue = JSON.stringify(groupId)
      const value = Buffer.from(jsonStrOriginalValue).toString('base64')
      // we use position: absolute to make the element to not participate in flexbox layout
      // (making it not a flexbox child)
      const result = `<span class='jsreport-pdf-utils-page-group' style='position:absolute;text-transform: none;opacity: 0.01;font-size:1.1px'>group@@@${value}@@@</span>`
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
      const result = `<span class='jsreport-pdf-utils-page-item' style='position:absolute;text-transform: none;opacity: 0.01;font-size:1.1px'>item@@@${value}@@@</span>`
      console.log(`Pdf utils adding item field, value: ${jsonStrOriginalValue}`)
      return result
    }

    if (req.template.helpers && typeof req.template.helpers === 'object') {
      req.template.helpers.pdfFormField = pdfFormField
      req.template.helpers.pdfCreatePagesGroup = pdfCreatePagesGroup
      req.template.helpers.pdfAddPageItem = pdfAddPageItem
    } else {
      req.template.helpers = pdfFormField + '\n' + pdfCreatePagesGroup + '\n' + pdfAddPageItem + '\n' + (req.template.helpers || '')
    }
  })

  // we insert to the front so we can run before reports or scripts
  reporter.afterRenderListeners.insert(0, 'pdf-utils', async (req, res) => {
    if (
      req.template.pdfPassword == null &&
      req.template.pdfMeta == null &&
      req.template.pdfSign == null &&
      (!req.template.pdfOperations || req.template.pdfOperations.length === 0) &&
      !req.context.pdfUtilsOutlines &&
      !req.context.pdfUtilsForms
    ) {
      return
    }

    if (!req.template.recipe.includes('pdf')) {
      reporter.logger.debug('Skipping pdf utils processing because template is rendered with non-pdf recipe.', req)
      return
    }

    let pdfSign

    if (req.template.pdfSign) {
      let password = req.template.pdfSign.certificateAsset ? req.template.pdfSign.certificateAsset.password : null

      let certificateAsset = req.template.pdfSign.certificateAsset

      if (req.template.pdfSign.certificateAssetShortid) {
        certificateAsset = await reporter.documentStore.collection('assets').findOne({ shortid: req.template.pdfSign.certificateAssetShortid }, req)

        if (!certificateAsset) {
          throw reporter.createError(`Asset with shortid ${req.template.pdfSign.certificateAssetShortid} was not found`, {
            statusCode: 400
          })
        }
        if (certificateAsset.pdfSign && certificateAsset.pdfSign.passwordSecure) {
          try {
            password = await reporter.encryption.decrypt(certificateAsset.pdfSign.passwordSecure)
          } catch (e) {
            if (e.encryptionNoSecret) {
              e.message = missingSecretMessage
            } else if (e.encryptionDecryptFail) {
              e.message = 'pdf-sign data decrypt failed, looks like secret key value is different to the key used to encrypt sensitive data, make sure "encryption.secretKey" was not changed'
            }

            throw e
          }
        }
      } else if (certificateAsset && !Buffer.isBuffer(certificateAsset.content)) {
        certificateAsset.content = Buffer.from(certificateAsset.content, certificateAsset.encoding || 'utf8')
      }

      if (certificateAsset) {
        pdfSign = {
          password,
          reason: req.template.pdfSign.reason,
          certificateContent: certificateAsset.content.toString('base64')
        }
      }
    }

    let pdfPassword

    if (
      req.template.pdfPassword != null &&
      (
        req.template.pdfPassword.password != null ||
        req.template.pdfPassword.ownerPassword != null
      )
    ) {
      pdfPassword = req.template.pdfPassword
    }

    let pdfMeta = req.template.pdfMeta

    const isPreviewRequest = req.options.preview === true || req.options.preview === 'true'

    if (isPreviewRequest && pdfPassword != null) {
      reporter.logger.debug('Skipping pdf-utils password addition, the feature is disabled during preview requests', req)
      pdfPassword = null
    }

    if (isPreviewRequest && pdfSign != null) {
      reporter.logger.debug('Skipping pdf-utils signature addition, the feature is disabled during preview requests', req)
      pdfSign = null
    }

    reporter.logger.info('pdf-utils is starting pdf processing', req)

    const result = await reporter.executeScript(
      {
        pdfContent: res.content.toString('base64'),
        operations: req.template.pdfOperations || [],
        outlines: req.context.pdfUtilsOutlines,
        pdfMeta,
        pdfPassword,
        pdfSign
      },
      {
        execModulePath: path.join(__dirname, 'scriptPdfProcessing.js'),
        // run script with no limit by default,
        // the reason for this is that pdf utils execution is composed of many operations
        // and each one of them have timeout controls already (chrome timeout, template engine timeout, script timeout).
        // if the single timeout option is set then this script can timeout in which case the custom error message is useful
        timeout: -1,
        timeoutErrorMessage: 'Timeout during execution of pdf-utils operations',
        callbackModulePath: path.join(__dirname, 'scriptCallbackRender.js')
      },
      req
    )

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
    if (reporter.scripts && reporter.scripts.addProxyMethods) {
      const proxyPdfUtilsMethodsPath = path.join(__dirname, 'proxyPdfUtilsMethods.js')
      const proxyPdfUtilsHandlersPath = path.join(__dirname, 'proxyPdfUtilsHandlers.js')

      reporter.scripts.addProxyMethods(proxyPdfUtilsMethodsPath, proxyPdfUtilsHandlersPath)
    }

    if (reporter.documentStore.collection('assets')) {
      reporter.documentStore.collection('assets').beforeInsertListeners.add('pdf-sign', async (doc, req) => {
        if (!doc.pdfSign || !doc.pdfSign.passwordRaw) {
          return
        }

        try {
          doc.pdfSign.passwordSecure = await reporter.encryption.encrypt(doc.pdfSign.passwordRaw)
        } catch (e) {
          if (e.encryptionNoSecret) {
            e.message = missingSecretMessage
          }

          throw e
        }

        doc.pdfSign.passwordRaw = null
        doc.pdfSign.passwordFilled = true
      })

      reporter.documentStore.collection('assets').beforeUpdateListeners.add('pdf-sign', async (q, u, req) => {
        if (!u.$set.pdfSign || !u.$set.pdfSign.passwordRaw) {
          return
        }

        try {
          u.$set.pdfSign.passwordSecure = await reporter.encryption.encrypt(u.$set.pdfSign.passwordRaw)
        } catch (e) {
          if (e.encryptionNoSecret) {
            e.message = missingSecretMessage
          }

          throw e
        }

        u.$set.pdfSign.passwordRaw = null
        u.$set.pdfSign.passwordFilled = true
      })
    }
  })
}
