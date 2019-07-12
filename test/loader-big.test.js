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

    const stats = await webpack('fixture-big.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })
})
