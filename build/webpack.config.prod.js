const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')

module.exports = env => {
  return merge(base(env), {
    mode: 'production',
    entry: {
      background: './src/background.js',
      app: './src/index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist')
    }
  })
}
