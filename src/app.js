import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import 'normalize.css'

import { history } from './store'

import Nav from './pages/Nav'
import Home from './pages/Home'
import ImageKiller from './pages/ImageKiller'
import ArticleGuard from './pages/ArticleGuard'

function App () {
  return (
    <div>
      <ConnectedRouter history={history}>
        <Nav></Nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/imageKiller" component={ImageKiller} />
          <Route path="/articleGuard" component={ArticleGuard} />
        </Switch>
      </ConnectedRouter>
    </div>
  )
}

export default hot(App)
