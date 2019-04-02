const { spawn, execSync } = require('child_process')
const path = require('path')
const electron = require('electron')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const devConfig = require('./webpack.config.dev')
const { serverConfig } = require('../config')

const env = 'development'
const compiler = webpack(devConfig(env))

const config = {
  port: serverConfig.port,
  hot: true,
  contentBase: path.join(__dirname, '../dist'),
  watchOptions: {
    poll: true,
    ignored: /node_modules/
  },
  historyApiFallback: {
    verbose: true,
    disableDotRule: false
  },
  before () {
    console.log('Starting Main Process...')
    spawn('npm', ['run', 'dev:electron'], {
      shell: true,
      env: process.env,
      stdio: 'inherit'
    })
      .on('close', code => process.exit(code))
      .on('error', spawnError => console.error(spawnError))
  }
}

const devServer = new WebpackDevServer(compiler, config)

devServer.listen(serverConfig.port, serverConfig.host, err => {
  if (err) return console.log(err)
})
