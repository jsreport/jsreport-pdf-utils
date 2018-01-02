const PDF = require('pdfjs/lib/object')
const Parser = require('pdfjs/lib/parser/parser')

module.exports = class EmbeddedPdf {
  constructor (src, box) {
    const parser = new Parser(src)
    parser.parse()

    const catalog = parser.trailer.get('Root').object.properties
    const pages = catalog.get('Pages').object.properties
    const first = pages.get('Kids')[0].object.properties
    const mediaBox = first.get('MediaBox') || pages.get('MediaBox')

    this.page = first
    this.width = mediaBox[2]
    this.box = box
    // this.height = Math.round(convertPrintParameterToInches(height) * 72) // mediaBox[3]

    const contents = this.page.get('Contents')
    this.xobjCount = Array.isArray(contents) ? contents.length : 1
  }

  async write (doc, xobjs) {
    const resources = this.page.get('Resources')
    const bbox = new PDF.Array(this.box) /* [0, 792 - this.height, 612, 792] */

    for (let i = 0; i < this.xobjCount; ++i) {
      const xobj = xobjs[i]

      xobj.prop('Subtype', 'Form')
      xobj.prop('FormType', 1)
      xobj.prop('BBox', /* bbox */ new PDF.Array([0, 0, 612, 792]))
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
