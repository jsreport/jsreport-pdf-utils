const PDF = require('pdfjs/lib/object')
const Parser = require('pdfjs/lib/parser/parser')

const unitToPixels = {
  'px': 1,
  'in': 96,
  'cm': 37.8,
  'mm': 3.78
}

function convertPrintParameterToInches (parameter) {
  if (typeof parameter === 'undefined') { return undefined }
  let pixels
  if (typeof parameter === 'number' || parameter instanceof Number) {
    // Treat numbers as pixel values to be aligned with phantom's paperSize.
    pixels = /** @type {number} */ (parameter)
  } else if (typeof parameter === 'string' || parameter instanceof String) {
    const text = /** @type {string} */ (parameter)
    let unit = text.substring(text.length - 2).toLowerCase()
    let valueText = ''
    if (unitToPixels.hasOwnProperty(unit)) {
      valueText = text.substring(0, text.length - 2)
    } else {
      // In case of unknown unit try to parse the whole parameter as number of pixels.
      // This is consistent with phantom's paperSize behavior.
      unit = 'px'
      valueText = text
    }
    const value = Number(valueText)
    console.assert(!isNaN(value), 'Failed to parse parameter value: ' + text)
    pixels = value * unitToPixels[unit]
  } else {
    throw new Error('page.pdf() Cannot handle parameter type: ' + (typeof parameter))
  }
  return pixels / 96
}

module.exports = class EmbeddedPdf {
  constructor (src, height) {
    const parser = new Parser(src)
    parser.parse()

    const catalog = parser.trailer.get('Root').object.properties
    const pages = catalog.get('Pages').object.properties
    const first = pages.get('Kids')[0].object.properties
    const mediaBox = first.get('MediaBox') || pages.get('MediaBox')

    this.page = first
    this.width = mediaBox[2]
    this.height = Math.round(convertPrintParameterToInches(height) * 72) // mediaBox[3]

    const contents = this.page.get('Contents')
    this.xobjCount = Array.isArray(contents) ? contents.length : 1
  }

  async write (doc, xobjs) {
    const resources = this.page.get('Resources')
    const bbox = new PDF.Array([0, 792 - this.height, 612, 792])

    for (let i = 0; i < this.xobjCount; ++i) {
      const xobj = xobjs[i]

      xobj.prop('Subtype', 'Form')
      xobj.prop('FormType', 1)
      xobj.prop('BBox', bbox)
      xobj.prop('Resources', resources instanceof PDF.Object ? resources.toReference() : resources)

      let contents = this.page.get('Contents')
      if (Array.isArray(contents)) {
        contents = contents[i].object
      } else {
        contents = contents.object
      }

      const content = new PDF.Stream(xobj)
      content.content = contents.content.content

      if (contents.properties.has('Filter')) {
        xobj.prop('Filter', contents.properties.get('Filter'))
      }
      xobj.prop('Length', contents.properties.get('Length'))
      if (contents.properties.has('Length1')) {
        xobj.prop('Length1', contents.properties.get('Length1'))
      }

      const objects = []
      Parser.addObjectsRecursive(objects, xobj)

      // first, register objects to assign IDs (for references)
      for (const obj of objects) {
        doc._registerObject(obj, true)
      }

      // write objects
      for (const obj of objects) {
        await doc._writeObject(obj)
      }

      await doc._writeObject(xobj)
    }
  }
}
