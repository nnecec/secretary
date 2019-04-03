import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Pane, Tablist, Tab } from 'evergreen-ui'

import Nav from './pages/shared/Nav'
import Home from './pages/Home'
import ImageKiller from './pages/ImageKiller'

function App () {
  return (
    <Pane>
      <Router>
        <Nav></Nav>

        <Route path="/" exact component={Home} />
        <Route path="/imageKiller" component={ImageKiller} />
      </Router>
    </Pane>
  )
}

export default hot(App)
