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

    expect(modules[0].source).toContain('Expected property name')
    expect(errors).toHaveLength(1)
    expect(errors[0].message || errors[0]).toContain('Expected property name')
    expect(errors[0].message || errors[0]).not.toContain('TypeError')
    expect(warnings).toEqual([])
  })
})
