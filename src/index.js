const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')

const schema = require('./options.json')

const DEFAULT_OPTIONS = {
  limit: 10240,
}

function shouldInline(limit, size) {
  return size < parseInt(limit, 10)
}

// https://v8.dev/blog/cost-of-javascript-2019#json
function loader(source) {
  const options = Object.assign({}, DEFAULT_OPTIONS, getOptions(this))

  validate(schema, options, 'JSON Perf Loader')

  const content = Buffer.isBuffer(source) ? source.toString('utf8') : source
  const size = Buffer.isBuffer(source)
    ? source.length
    : Buffer.byteLength(content)
  let value

  try {
    value = JSON.parse(content)
  } catch (error) {
    throw error
  }

  if (shouldInline(options.limit, size)) {
    value = JSON.stringify(value)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')

    return `module.exports = ${value}`
  }

  // the outer JSON.stringify is parsed by JavaScript
  // the inner JSON.stringify is parsed by JSON.parse
  return `module.exports = JSON.parse(${JSON.stringify(JSON.stringify(value))})`
}

loader.raw = true

module.exports = loader
