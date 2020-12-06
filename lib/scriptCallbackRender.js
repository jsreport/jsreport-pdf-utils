
module.exports = async function render (reporter, req, { shortidOrTemplate, data = {} }) {
  let templateToUse

  if (typeof shortidOrTemplate === 'string') {
    templateToUse = { shortid: shortidOrTemplate }
  } else {
    templateToUse = { ...shortidOrTemplate }
  }

  const result = await reporter.render({ template: templateToUse, data, options: { pdfUtils: { removeHiddenMarks: false } } }, req)
  return {
    content: result.content.toString('base64')
  }
}
