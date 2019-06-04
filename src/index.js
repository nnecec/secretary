import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { setConfig } from 'react-hot-loader'

import { ThemeProvider } from '@material-ui/styles'

import App from './app'
import store from './store'
import { theme } from './stylesheets/theme'

setConfig({
  reloadHooks: false
})

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)
