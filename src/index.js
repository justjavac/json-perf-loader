const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')

const schema = require('./options.json')

const DEFAULT_OPTIONS = {
  limit: 10240,
}

function shouldInline(limit, size) {
  return size <= parseInt(limit, 10)
}

// https://v8.dev/blog/cost-of-javascript-2019#json
module.exports = function (source) {
  const options = Object.assign({}, DEFAULT_OPTIONS, getOptions(this))

  validate(schema, options, 'JSON Perf Loader')

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

  // the outer JSON.stringify is parsed by JavaScript
  // the inner JSON.stringify is parsed by JSON.parse
  return `module.exports = JSON.parse(${JSON.stringify(JSON.stringify(value))})`
}

exports.raw = true
