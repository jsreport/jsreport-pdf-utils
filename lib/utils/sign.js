const pdfjs = require('jsreport-pdfjs')
const PDF = require('jsreport-pdfjs/lib/object')
const { SignPdf } = require('node-signpdf')

class PDFHexString {
  constructor (v) {
    this.str = v
  }

  toString () {
    return `<${this.str}>`
  }
}

const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********'

// the code take from node-signpdf tests and rewriten from pdfkit to the pdfjs
function addSignaturePlaceholder (pdfBuffer, reason) {
  const extContent = new pdfjs.ExternalDocument(pdfBuffer)
  const doc = new pdfjs.Document()

  const sig = new PDF.Object('Sig')
  sig.prop('Filter', 'Adobe.PPKLite')
  sig.prop('SubFilter', 'adbe.pkcs7.detached')
  sig.prop('ByteRange', new PDF.Array([
    0,
    `/${DEFAULT_BYTE_RANGE_PLACEHOLDER}`,
    `/${DEFAULT_BYTE_RANGE_PLACEHOLDER}`,
    `/${DEFAULT_BYTE_RANGE_PLACEHOLDER}`
  ]))

  sig.prop('Contents', new PDFHexString('0'.repeat(8192)))
  sig.prop('Reason', new PDF.String(reason || 'Signed'))
  // 'D:20190521082633Z')
  const pdfDateStr = new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace('T', '').substring(0, 14) + 'Z'
  sig.prop('M', new PDF.String(`D:${pdfDateStr}`))
  doc._registerObject(sig)

  const annot = new PDF.Object('Annot')
  annot.prop('Subtype', 'Widget')
  annot.prop('FT', 'Sig')
  annot.prop('Rect', new PDF.Array([0, 0, 0, 0]))
  annot.prop('V', sig.toReference())
  annot.prop('T', new PDF.String('Signature1'))
  annot.prop('F', 4)
  doc._registerObject(annot)

  const form = new PDF.Object('AcroForm')
  form.prop('SigFlags', 3)
  form.prop('Fields', new PDF.Array([annot.toReference()]))
  doc._registerObject(form)

  const kids = extContent.pages.get('Kids')

  for (const page of kids) {
    page.object.prop('Annots', new PDF.Array([annot.toReference()]))
  }

  doc._finalizeCatalog.push(() => {
    doc._catalog.prop('AcroForm', form.toReference())
    doc._writeObject(form)
    doc._writeObject(sig)
    doc._writeObject(annot)
  })

  doc.addPagesOf(extContent)
  return doc.asBuffer()
}

module.exports = async (pdfBuffer, certificateBuffer, password, reason) => {
  pdfBuffer = await addSignaturePlaceholder(pdfBuffer, reason)

  const signer = new SignPdf()

  return signer.sign(pdfBuffer, certificateBuffer, password ? { passphrase: password } : undefined)
}
