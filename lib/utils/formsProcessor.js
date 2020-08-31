const PDF = require('jsreport-pdfjs/lib/object')
const parseColor = require('parse-color')

module.exports = (doc, ext) => {
  const newObjects = []

  const acroFormObj = new PDF.Object()
  acroFormObj.prop('Fields', new PDF.Array())
  acroFormObj.prop('NeedAppearances', true)
  acroFormObj.prop('DR', new PDF.Dictionary({
    'Font': new PDF.Dictionary()
  }))

  doc._finalize.push(() => {
    if (newObjects.length === 0) {
      return
    }

    for (let obj of newObjects) {
      doc._writeObject(obj)
    }

    doc._writeObject(acroFormObj)
  })

  doc._finalizeCatalog.push(() => {
    if (newObjects.length === 0) {
      return
    }
    doc._catalog.prop('AcroForm', acroFormObj.toReference())
  })

  return function processForm ({
    doc,
    text,
    position,
    page,
    pageIndex,
    height
  }) {
    try {
      const formSpec = JSON.parse(Buffer.from(text, 'base64').toString())

      let annotsObj = new PDF.Object('Annot')
      acroFormObj.prop('Fields', new PDF.Array([...acroFormObj.properties.get('Fields'), annotsObj.toReference()]))
      doc._registerObject(annotsObj)
      newObjects.push(annotsObj)

      annotsObj.prop('Subtype', 'Widget')
      annotsObj.prop('T', new PDF.String(formSpec.name))
      annotsObj.prop('F', 4)
      annotsObj.prop('P', page.toReference())

      processValue(formSpec, annotsObj)
      processBorder(formSpec, annotsObj)
      processText(formSpec, annotsObj, newObjects, doc, acroFormObj)
      processBackgroundColor(formSpec, annotsObj)
      processLabel(formSpec, annotsObj)
      processTextAlign(formSpec, annotsObj)
      processType(formSpec, annotsObj)
      processFlags(formSpec, annotsObj)
      processFormat(formSpec, annotsObj)
      processRectangle(formSpec, annotsObj, pageIndex, height, position)

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

// looks this is static for pdfs rendered by chrome
const SCALE = 0.75
// the size of form@@@....
const HIDDEN_TEXT_SIZE = 1.1
function processRectangle (formSpec, annotation, pageIndex, height, position) {
  let TOP = height * (pageIndex + 1)

  const dimension = [
    position[0] * SCALE,
    TOP - (position[1] + formSpec.height - HIDDEN_TEXT_SIZE) * SCALE,
    (position[0] + formSpec.width) * SCALE,
    TOP - ((position[1] - HIDDEN_TEXT_SIZE) * SCALE)
  ]
  annotation.prop('Rect', new PDF.Array(dimension))
}

function processBorder (formSpec, annotation) {
  let borderArray = [0, 0, 0]
  if (formSpec.border) {
    borderArray = formSpec.border.split(',')
  }
  annotation.prop('Border', new PDF.Array(borderArray))
}

function flags (def, vals) {
  let result = 0
  Object.keys(def).forEach(key => {
    if (vals[key] === true) {
      result |= def[key]
    }
  })
  return result
}

function processValue (formSpec, annotation) {
  if (formSpec.value != null) {
    annotation.prop('V', new PDF.String(formSpec.value))
  }

  if (formSpec.defaultValue != null) {
    annotation.prop('DV', new PDF.String(formSpec.defaultValue))
  }
}

function processText (formSpec, annotation, newObjects, doc, acroFormObj) {
  let color = '0 g'
  if (formSpec.color) {
    color = parseColor(formSpec.color).rgb.map(c => c / 255).join(' ') + ' rg'
  }
  const fontSize = formSpec.fontSize ? formSpec.fontSize : 0
  const fontFamily = formSpec.fontFamily || 'Helvetica'
  annotation.prop('DA', new PDF.String(`/${fontFamily} ${fontSize} Tf ${color}`))

  if (acroFormObj.properties.get('DR').get('Font').get(fontFamily) != null) {
    return
  }

  // without encoding the czech čšěčšě chars wrongly paints in Acrobat Reader
  const encodingObject = new PDF.Object('Encoding')
  encodingObject.prop('BaseEncoding', 'WinAnsiEncoding')// StandardEncoding not working
  doc._registerObject(encodingObject)
  newObjects.push(encodingObject)

  const fontObject = new PDF.Object('Font')
  fontObject.prop('BaseFont', fontFamily)
  fontObject.prop('Name', fontFamily)
  fontObject.prop('Subtype', 'Type1')
  fontObject.prop('Encoding', encodingObject.toReference())
  doc._registerObject(fontObject)
  newObjects.push(fontObject)
  acroFormObj.properties.get('DR').get('Font').set(fontFamily, fontObject.toReference())
}

function processBackgroundColor (formSpec, annotation) {
  if (formSpec.backgroundColor != null) {
    annotation.prop('MK', annotation.properties.get('MK') || new PDF.Dictionary())
    const mkDictionary = annotation.properties.get('MK')
    mkDictionary.set('BG', new PDF.Array(parseColor(formSpec.backgroundColor).rgb.map(c => c / 255)))
  }
}

function processLabel (formSpec, annotation) {
  if (formSpec.label != null) {
    annotation.prop('MK', annotation.properties.get('MK') || new PDF.Dictionary())
    const mkDictionary = annotation.properties.get('MK')
    mkDictionary.set('CA', new PDF.String(formSpec.label))
  }
}

function processTextAlign (formSpec, annotation) {
  function resolveTextAlign (a) {
    switch (a) {
      case 'left': return 0
      case 'center': return 1
      case 'right': return 2
      default: throw new Error(`Unkwnown textAlign ${a}`)
    }
  }

  if (formSpec.textAlign != null) {
    annotation.prop('Q', resolveTextAlign(formSpec.textAlign))
  }
}

function processType (formSpec, annotation) {
  switch (formSpec.type) {
    case 'text': return processTextType(formSpec, annotation)
    case 'signature': return processSignatureType(formSpec, annotation)
    case 'button': return processButtonType(formSpec, annotation)
    case 'combo': return processComboType(formSpec, annotation)
    default: throw new Error(`Unsupported pdfFormElement type ${formSpec.type}`)
  }
}

function processTextType (formSpec, annotation) {
  annotation.prop('FT', 'Tx')
}

function processSignatureType (formSpec, annotation) {
  annotation.prop('FT', 'Sig')
}

function processComboType (formSpec, annotation) {
  formSpec.combo = true
  annotation.prop('FT', 'Ch')
  annotation.prop('Opt', new PDF.Array(formSpec.items.map(i => `(${i})`)))
}

const SUBMIT_FORM_FLAGS = {
  includeNoValueFields: 2,
  exportFormat: 4,
  getMethod: 8,
  submitCoordinates: 16,
  XFDF: 32,
  includeAppendSaves: 64,
  includeAnnotations: 128,
  submitPDF: 256,
  canonicalFormat: 512,
  exclNonUserAnnots: 1024,
  excldFKEy: 2048,
  embedForm: 8192
}

function processButtonType (formSpec, annotation) {
  formSpec.pushButton = true
  annotation.prop('FT', 'Btn')

  if (formSpec.type === 'button' && formSpec.action === 'submit') {
    const aDicitonary = new PDF.Dictionary({
      'S': 'SubmitForm',
      'Type': 'Action',
      'Flags': flags(SUBMIT_FORM_FLAGS, formSpec)
    })

    if (formSpec.url != null) {
      aDicitonary.set('F', new PDF.String(formSpec.url))
    }

    annotation.prop('A', aDicitonary)
  }

  if (formSpec.type === 'button' && formSpec.action === 'reset') {
    annotation.prop('A', new PDF.Dictionary({
      'S': 'ResetForm',
      'Type': 'Action'
    }))
  }
}

const FIELD_FLAGS = {
  readOnly: 1,
  required: 2,
  noExport: 4,
  multiline: 4096,
  password: 8192,
  pushButton: 65536,
  combo: 131072
}

function processFlags (formSpec, annotsObj) {
  const result = flags(FIELD_FLAGS, formSpec)

  if (result !== 0) {
    annotsObj.prop('Ff', result)
  }
}

const FORMAT_SPECIAL = {
  zip: '0',
  zipPlus4: '1',
  zip4: '1',
  phone: '2',
  ssn: '3'
}
const FORMAT_DEFAULT = {
  number: {
    fractionalDigits: 0,
    sepComma: false,
    negStyle: 'MinusBlack',
    currency: '',
    currencyPrepend: true
  },
  percent: {
    fractionalDigits: 0,
    sepComma: false
  }
}

function processFormat (formSpec, annotsObj) {
  if (formSpec.formatType == null) {
    return
  }

  const f = {}
  for (let key in formSpec) {
    if (key.startsWith('format')) {
      let tk = key.substring('format'.length)
      tk = tk.charAt(0).toLowerCase() + tk.substring(1)
      f[tk] = formSpec[key]
    }
  }

  let fnKeystroke
  let fnFormat
  let params = ''

  if (FORMAT_SPECIAL[f.type] !== undefined) {
    fnKeystroke = `AFSpecial_Keystroke`
    fnFormat = `AFSpecial_Format`
    params = FORMAT_SPECIAL[f.type]
  } else {
    let format = f.type.charAt(0).toUpperCase() + f.type.slice(1)
    fnKeystroke = `AF${format}_Keystroke`
    fnFormat = `AF${format}_Format`

    if (f.type === 'date') {
      fnKeystroke += 'Ex'
      fnFormat += 'Ex'
      params = `"${f.mask}"`
    } else if (f.type === 'time') {
      if (f.mask === 'HH:mm') {
        params = 0
      }
      if (f.mask === 'hh:mm') {
        params = 1
      }
      if (f.mask === 'HH:mm:ss') {
        params = 2
      }
      if (f.mask === 'hh:mm:ss') {
        params = 3
      }
    } else if (f.type === 'number') {
      let p = Object.assign({}, FORMAT_DEFAULT.number, f)
      params = [
        p.fractionalDigits,
        p.sepComma ? '0' : '1',
        '"' + p.negStyle + '"',
        'null',
        '"' + p.currency + '"',
        p.currencyPrepend
      ].join(',')
    } else if (f.type === 'percent') {
      let p = Object.assign({}, FORMAT_DEFAULT.percent, f)
      params = String([p.fractionalDigits, p.sepComma ? '0' : '1'].join(','))
    }
  }

  annotsObj.prop('AA', new PDF.Dictionary({
    K: new PDF.Dictionary({
      S: 'JavaScript',
      JS: new PDF.String(`${fnKeystroke}(${params});`)
    }),
    F: new PDF.Dictionary({
      S: 'JavaScript',
      JS: new PDF.String(`${fnFormat}(${params});`)
    })
  }))
}
