# json-perf-loader

[![build][build]][build-url]
[![cover][cover]][cover-url]
[![npm][npm]][npm-url]
[![node][node]][node-url]
[![download][download]][download-url]
[![deps][deps]][deps-url]
[![size][size]][size-url]

A loader for webpack to load JSON with performance advice.

## The cost of parsing JSON

See [The cost of parsing JSON - V8](https://v8.dev/blog/cost-of-javascript-2019#json)

> Because the JSON grammar is much simpler than JavaScript’s grammar, JSON can be parsed more efficiently than JavaScript.
> This knowledge can be applied to improve start-up performance for web apps that ship large JSON-like configuration object literals (such as inline Redux stores).
> Instead of inlining the data as a JavaScript object literal.
>
> As long as the JSON string is only evaluated once, the `JSON.parse` approach is much faster compared to the JavaScript object literal, especially for cold loads.
> A good rule of thumb is to apply this technique for objects of **10 kB or larger** — but as always with performance advice, measure the actual impact before making any changes.

## Getting Started

To begin, you'll need to install `json-perf-loader`:

```shell
$ npm install json-perf-loader --save-dev
```

`json-perf-loader` works like
[`json-loader`](https://github.com/justjavac/json-loader), but much faster.

**index.js**

```js
import json from './file.json'
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'json-perf-loader',
            options: {
              limit: 4096,
            },
          },
        ],
      },
    ],
  },
}
```

And run `webpack` via your preferred method.

**Note: `type: "javascript/auto"` is require**. See https://webpack.js.org/configuration/module/#ruletype

> `Rule.type` sets the type for a matching module.
> This prevents defaultRules and their default importing behaviors from occurring.
> For example, if you want to load a `.json` file through a custom loader, you'd need to set the `type` to `javascript/auto` to bypass webpack's built-in json importing.

## Options

### `limit`

Type: `Number|String`
Default: `1024 * 10`

The limit can be specified via loader options and defaults to `1024 * 10`. This is the recommended value for the V8 team.

#### `Number`

A `Number` specifying the maximum size of a file in bytes. If the file size is
**equal** or **greater** than the limit `JSON.parse` will be used.

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'json-perf-loader',
            options: {
              limit: 10,
            },
          },
        ],
      },
    ],
  },
}
```

## License

[MIT](./LICENSE)

[build]: https://travis-ci.com/justjavac/json-perf-loader.svg?branch=master
[build-url]: https://travis-ci.com/justjavac/json-perf-loader
[npm]: https://img.shields.io/npm/v/json-perf-loader.svg
[npm-url]: https://npmjs.com/package/json-perf-loader
[node]: https://img.shields.io/node/v/json-perf-loader.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/justjavac/json-perf-loader.svg
[deps-url]: https://david-dm.org/justjavac/json-perf-loader
[download]: https://img.shields.io/npm/dm/json-perf-loader.svg?style=flat
[download-url]: https://npmcharts.com/compare/json-perf-loader?minimal=true
[tests]: https://dev.azure.com/justjavac/json-perf-loader/_apis/build/status/justjavac.json-perf-loader?branchName=master
[tests-url]: https://dev.azure.com/justjavac/json-perf-loader/_build/latest?definitionId=2&branchName=master
[cover]: https://codecov.io/gh/justjavac/json-perf-loader/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/justjavac/json-perf-loader
[size]: https://packagephobia.now.sh/badge?p=json-perf-loader
[size-url]: https://packagephobia.now.sh/result?p=json-perf-loader
