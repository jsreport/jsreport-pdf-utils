
module.exports = async function render (reporter, req, { shortidOrTemplate, data = {}, logs }, cb) {
  let templateToUse

  try {
    if (logs) {
      // we handle logs here in callback in order to mantain correct order of logs
      // between render callback calls
      logs.forEach((m) => {
        reporter.logger[m.level](m.message, { ...req, timestamp: m.timestamp })
      })
    }

    if (typeof shortidOrTemplate === 'string') {
      templateToUse = { shortid: shortidOrTemplate }
    } else {
      templateToUse = { ...shortidOrTemplate }
    }

    const result = await reporter.render({ template: templateToUse, data }, req)

    cb(null, result.content.toString('base64'))
  } catch (e) {
    cb(e)
  }
}
