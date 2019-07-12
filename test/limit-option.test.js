const webpack = require('./helpers/compiler')

describe('limit option', () => {
  it('not specify', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {},
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).not.toMatch('JSON.parse')
  })

  it('0 ({Number})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: 0,
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })

  it('0.1 ({Number})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: 0.1,
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })

  it('666 ({Number})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: 666,
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).not.toMatch('JSON.parse')
  })

  it('Number.MAX_SAFE_INTEGER ({Number})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: Number.MAX_SAFE_INTEGER,
        },
      },
    }

    const stats = await webpack('fixture-big.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).not.toMatch('JSON.parse')
  })

  it('Number.MIN_SAFE_INTEGER ({Number})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: Number.MIN_SAFE_INTEGER,
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })

  it('0 ({String})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: '0',
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })

  it('0.1 ({String})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: '0.1',
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).toMatch('JSON.parse')
  })

  it('666 ({String})', async () => {
    const config = {
      loader: {
        test: /\.json$/,
        type: 'javascript/auto',
        options: {
          limit: '666',
        },
      },
    }

    const stats = await webpack('fixture.js', config)
    const [{ source }] = stats.toJson().modules

    expect(source).not.toMatch('JSON.parse')
  })
})
