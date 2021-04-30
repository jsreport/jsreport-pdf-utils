module.exports = {
  'name': 'pdf-utils',
  'main': 'lib/main.js',
  'dependencies': [ 'templates' ],
  'optionsSchema': {
    extensions: {
      'pdf-utils': {
        type: 'object',
        properties: {
          maxSignaturePlaceholderLength: { type: 'number', default: 8192 }
        }
      }
    }
  }
}
