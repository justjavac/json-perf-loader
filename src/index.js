const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')

const schema = require('./options.json')

function shouldInline(limit = 10240, size) {
  return size <= parseInt(limit, 10)
}

// https://v8.dev/blog/cost-of-javascript-2019#json
module.exports = function(source) {
  const options = getOptions(this) || {}

  validateOptions(schema, options, 'JSON Perf Loader')

  let value

  try {
    value = typeof source === 'string' ? JSON.parse(source) : source
  } catch (error) {
    this.emitError(error)
  }

  if (shouldInline(options.limit, source.length)) {
    value = JSON.stringify(value)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')

    return `module.exports = ${value}`
  }

  return `module.exports = JSON.parse('${JSON.stringify(value)}')`
}

exports.raw = true
