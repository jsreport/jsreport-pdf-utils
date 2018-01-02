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

function convertValToPdfUnit (val) {
  return Math.round(convertPrintParameterToInches(val) * 72)
}

// [0, 792 - this.height, 612, 792]
module.exports = (strBox) => {
  return null /*
  const box = strBox.split(' ')
  return [convertValToPdfUnit(box[0]), convertValToPdfUnit(box[1]), convertValToPdfUnit(box[2]), convertValToPdfUnit(box[3])]
  */
}
