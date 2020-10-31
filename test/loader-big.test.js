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

    // this will fail when there is an error e.g: `throw new Error...`
    expect(source.startsWith('module.exports = JSON.parse')).toEqual(true)
  })
})
