import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { ThemeProvider } from '@material-ui/styles'

import App from './app'
import store from './store'
import { theme } from './stylesheets/theme'

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
)
