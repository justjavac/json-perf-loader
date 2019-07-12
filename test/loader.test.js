const webpack = require('./helpers/compiler')

describe('Loader', () => {
  it('should works', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {},
      },
    }

    const stats = await webpack('fixture.js', config)
    const { modules, errors, warnings } = stats.toJson()

    expect(modules[0].source).toEqual('module.exports = {"foo":"bar"}')
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
