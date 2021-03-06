import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import 'normalize.css'

import { history } from './store'

import Nav from './pages/Nav'
import Home from './pages/Home'
import ImageKiller from './pages/ImageKiller'
import ArticleKiller from './pages/ArticleKiller'

function App () {
  return (
    <ConnectedRouter history={history}>
      <Nav></Nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/imageKiller" component={ImageKiller} />
        <Route path="/articleKiller" component={ArticleKiller} />
      </Switch>
    </ConnectedRouter>
  )
}

export default hot(App)
