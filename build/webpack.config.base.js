const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// const { dependencies } = require('../package.json')

module.exports = env => {
  return {
    target: 'electron-renderer',

    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`),
        utils: path.resolve(__dirname, '../src/utils')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' }),
      new HTMLWebpackPlugin({
        title: 'Secretary',
        template: path.resolve(__dirname, '../config/index.html')
      }),
      new webpack.NamedModulesPlugin()

    ]
  }
}
