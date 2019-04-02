const process = require('process')

const serverConfig = {
  port: process.env.PORT || 5001,
  publicPath: `http://localhost:5001/dist`
}

module.exports = {
  serverConfig
}
