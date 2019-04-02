const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const { serverConfig } = require('../config')

module.exports = env => {
  return merge.smart(base(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${serverConfig.port}/`,
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, '../src/index.js')
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist')
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  })
}
