// taken from https://github.com/foliojs/pdfkit/blob/master/lib/mixins/acroform.js
const PDF = require('jsreport-pdfjs/lib/object')

const FIELD_FLAGS = {
  readOnly: 1,
  required: 2,
  noExport: 4,
  multiline: 0x1000,
  password: 0x2000,
  toggleToOffButton: 0x4000,
  radioButton: 0x8000,
  pushButton: 0x10000,
  combo: 0x20000,
  edit: 0x40000,
  sort: 0x80000,
  multiSelect: 0x200000,
  noSpell: 0x400000
}
const FIELD_JUSTIFY = {
  left: 0,
  center: 1,
  right: 2
}
const VALUE_MAP = { value: 'V', defaultValue: 'DV' }
const FORMAT_SPECIAL = {
  zip: '0',
  zipPlus4: '1',
  zip4: '1',
  phone: '2',
  ssn: '3'
}
const FORMAT_DEFAULT = {
  number: {
    nDec: 0,
    sepComma: false,
    negStyle: 'MinusBlack',
    currency: '',
    currencyPrepend: true
  },
  percent: {
    nDec: 0,
    sepComma: false
  }
}

function _resolveType (type, opts) {
  if (type === 'text') {
    opts.FT = 'Tx'
  } else if (type === 'pushButton') {
    opts.FT = 'Btn'
    opts.pushButton = true
  } else if (type === 'radioButton') {
    opts.FT = 'Btn'
    opts.radioButton = true
  } else if (type === 'checkbox') {
    opts.FT = 'Btn'
  } else if (type === 'combo') {
    opts.FT = 'Ch'
    opts.combo = true
  } else if (type === 'list') {
    opts.FT = 'Ch'
  } else {
    throw new Error(`Invalid form annotation type '${type}'`)
  }
  return opts
}

function _resolveFormat (opts) {
  const f = opts.format
  if (f && f.type) {
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
        params = String(f.param)
      } else if (f.type === 'time') {
        params = String(f.param)
      } else if (f.type === 'number') {
        let p = Object.assign({}, FORMAT_DEFAULT.number, f)
        params = String(
          [
            String(p.nDec),
            p.sepComma ? '0' : '1',
            '"' + p.negStyle + '"',
            'null',
            '"' + p.currency + '"',
            String(p.currencyPrepend)
          ].join(',')
        )
      } else if (f.type === 'percent') {
        let p = Object.assign({}, FORMAT_DEFAULT.percent, f)
        params = String([String(p.nDec), p.sepComma ? '0' : '1'].join(','))
      }
    }
    opts.AA = opts.AA ? opts.AA : {}
    opts.AA.K = {
      S: 'JavaScript',
      JS: `${fnKeystroke}(${params});`
    }
    opts.AA.F = {
      S: 'JavaScript',
      JS: `${fnFormat}(${params});`
    }
  }
  delete opts.format
  return opts
}

function _resolveFlags (options) {
  let result = 0
  Object.keys(options).forEach(key => {
    if (FIELD_FLAGS[key]) {
      result |= FIELD_FLAGS[key]
      delete options[key]
    }
  })
  if (result !== 0) {
    options.Ff = options.Ff ? options.Ff : 0
    options.Ff |= result
  }
  return options
}

function _resolveJustify (options) {
  let result = 0
  if (options.align !== undefined) {
    if (typeof FIELD_JUSTIFY[options.align] === 'number') {
      result = FIELD_JUSTIFY[options.align]
    }
  }
  if (result !== 0) {
    options.Q = result // default
  }
  return options
}

function _resolveStrings (options) {
  if (options.items) {
    options.Opt = new PDF.Array(options.items.map(i => `(${i})`))
  }

  Object.keys(VALUE_MAP).forEach(key => {
    if (options[key] !== undefined) {
      options[VALUE_MAP[key]] = new PDF.String(options[key])
    }
  })
  if (options.label) {
    options.MK = options.MK ? options.MK : {}
    options.MK.CA = options.label
  }
  return options
}

module.exports = (options) => {
  let opts = Object.assign({}, options)
  opts = _resolveType(opts.type, opts)
  opts = _resolveFlags(opts)
  opts = _resolveJustify(opts)
  opts = _resolveStrings(opts)
  opts = _resolveFormat(opts)
  opts.T = new PDF.String(opts.name)
  return opts
}
