const webpack = require('./helpers/compiler')
const loader = require('../src')

describe('Loader', () => {
  it('should export raw loader', () => {
    expect(loader.raw).toEqual(true)
  })

  it('should handle buffer input', () => {
    const context = {
      query: {},
    }

    const source = Buffer.from('{"foo":"bar"}')

    expect(loader.call(context, source)).toEqual(
      'module.exports = {"foo":"bar"}',
    )
  })

  it('should works', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
      },
    }

    const stats = await webpack('fixture.js', config)
    const { modules, errors, warnings } = stats.toJson({ source: true })

    expect(modules[0].source).toEqual('module.exports = {"foo":"bar"}')
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
  })

  it('should works with webpack 5', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
      },
    }

    const stats = await webpack('fixture.js', config, { webpack: 5 })
    const { modules, errors, warnings } = stats.toJson({ source: true })
    const jsonModule = modules.find((module) =>
      module.name.includes('file.json'),
    )

    expect(jsonModule.source).toEqual('module.exports = {"foo":"bar"}')
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
  })

  it('should works when limit as a query string', async () => {
    const config = {
      rules: [
        {
          test: /\.json$/,
          type: 'javascript/auto',
          use: {
            loader: `${require.resolve('../src')}?limit=10000`,
          },
        },
      ],
    }

    const stats = await webpack('fixture.js', config)
    const { modules, errors, warnings } = stats.toJson()

    expect(modules[0].source).toEqual('module.exports = {"foo":"bar"}')
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
  })
})
