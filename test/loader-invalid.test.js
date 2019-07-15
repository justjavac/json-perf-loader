const webpack = require('./helpers/compiler')

describe('Loader invaild', () => {
  it('should throw error', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
      },
    }

    const stats = await webpack('fixture-invalid.js', config)
    const { modules, errors, warnings } = stats.toJson()

    expect(errors.length).toBeGreaterThan(0)
    expect(warnings).toEqual([])
  })
})
