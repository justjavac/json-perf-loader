const path = require('path')
const crypto = require('crypto')

const rimraf = require('rimraf')
const webpack4 = require('webpack4')
const webpack5 = require('webpack5')
const MemoryFS = require('memory-fs')

const createHash = crypto.createHash

crypto.createHash = (algorithm, options) => {
  return createHash.call(
    crypto,
    algorithm === 'md4' ? 'sha256' : algorithm,
    options,
  )
}

const webpack = (version) => (version === 5 ? webpack5 : webpack4)

const modules = (config) => {
  return {
    rules: config.rules
      ? config.rules
      : config.loader
      ? [
          {
            test: config.loader.test || /\.json$/,
            type: 'javascript/auto',
            use: {
              loader: path.resolve(__dirname, '../../src'),
              options: config.loader.options,
            },
          },
        ]
      : [],
  }
}

const plugins = (config) => [].concat(config.plugins || [])

const output = (config) => {
  return {
    path: path.resolve(
      __dirname,
      `../outputs/${config.output ? config.output : ''}`,
    ),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  }
}

module.exports = function (fixture, config, options) {
  config = {
    mode: 'development',
    devtool: config.devtool || false,
    context: path.resolve(__dirname, '..', 'fixtures'),
    entry: `./${fixture}`,
    output: output(config),
    module: modules(config),
    plugins: plugins(config),
  }
  config.output.hashFunction = 'sha256'

  // eslint-disable-next-line no-param-reassign
  options = Object.assign({ output: false }, options)

  if (options.output) {
    rimraf(config.output.path)
  }

  const compiler = webpack(options.webpack || 4)(config)

  if (!options.output) {
    compiler.outputFileSystem = new MemoryFS()
  }

  const purgeInputFileSystem = () => {
    if (compiler.inputFileSystem && compiler.inputFileSystem.purge) {
      compiler.inputFileSystem.purge()
    }
  }

  return new Promise((resolve, reject) =>
    compiler.run((error, stats) => {
      if (error) {
        purgeInputFileSystem()
        return reject(error)
      }

      if (compiler.close) {
        return compiler.close((closeError) => {
          purgeInputFileSystem()

          if (closeError) {
            return reject(closeError)
          }

          return resolve(stats)
        })
      }

      purgeInputFileSystem()
      return resolve(stats)
    }),
  )
}
