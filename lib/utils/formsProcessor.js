const PDF = require('jsreport-pdfjs/lib/object')
const createFieldDictionary = require('./pdfkitForm.js')
const SCALE = 0.75
const omit = require('lodash.omit')

module.exports = (doc, ext) => {
  const annotsObjects = []
  const fonts = new PDF.Dictionary()

  const acroFormObj = new PDF.Object()
  doc._finalize.push(() => {
    if (annotsObjects.length === 0) {
      return
    }

    for (let annotsObj of annotsObjects) {
      doc._writeObject(annotsObj)
    }

    const annnots = []
    for (const page of ext.pages.get('Kids')) {
      annnots.push(...(page.object.properties.get('Annots') || []))
    }

    acroFormObj.prop('Fields', new PDF.Array(annnots))
    // acroFormObj.prop('Da', new PDF.String('/F4 0 Tf 0 g'))
    acroFormObj.prop('NeedAppearances', true)
    acroFormObj.prop('DR', new PDF.Dictionary({
      'Font': fonts
    }))
    doc._writeObject(acroFormObj)
  })

  doc._finalizeCatalog.push(() => {
    if (annotsObjects.length === 0) {
      return
    }
    doc._catalog.prop('AcroForm', acroFormObj.toReference())
  })

  return function processForm (doc, t, font, p, page, pageIndex, height) {
    try {
      const formSpecText = t.substring(4 + 3, t.length - 3)
      const formSpec = JSON.parse(Buffer.from(formSpecText, 'base64').toString())

      let TOP = height * (pageIndex + 1)

      let annotsObj = new PDF.Object('Annot')
      annotsObj.prop('Subtype', 'Widget')

      const dimension = [
        p[0] * SCALE,
        TOP - (p[1] + formSpec.height - 1.1) * SCALE,
        (p[0] + formSpec.width) * SCALE,
        TOP - ((p[1] - 1.1) * SCALE)
      ]

      const fieldDictionary = omit(createFieldDictionary(formSpec), Object.keys(formSpec))
      for (let key in fieldDictionary) {
        annotsObj.prop(key, fieldDictionary[key])
      }
      annotsObj.prop('Rect', new PDF.Array(dimension))

      annotsObj.prop('Border', new PDF.Array([0, 0, 0]))
      annotsObj.prop('DA', new PDF.String(`/${font} 0 Tf 0 g`))
      fonts.set(font, page.properties.get('Resources').get('Font').get(font))
      annotsObj.prop('C', new PDF.Array([0, 0, 0]))
      annotsObj.prop('P', page.toReference())
      doc._registerObject(annotsObj)
      annotsObjects.push(annotsObj)

      if (page.properties.get('Annots')) {
        page.properties.get('Annots').push(annotsObj.toReference())
      } else {
        page.prop('Annots', new PDF.Array([annotsObj.toReference()]))
      }
    } catch (e) {
      e.isFormError = true
      throw e
    }
  }
}
