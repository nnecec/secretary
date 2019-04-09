import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { ConnectedRouter, push, replace } from 'connected-react-router'

import { Pane, Tablist, Tab } from 'evergreen-ui'

import { history } from './store'

import Nav from './pages/Nav'
import Home from './pages/Home'
import ImageKiller from './pages/ImageKiller'
import ArticleGuard from './pages/ArticleGuard'

function App () {
  return (

    <Pane>
      <ConnectedRouter history={history}>
        <Nav></Nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/imageKiller" component={ImageKiller} />
          <Route path="/articleGuard" component={ArticleGuard} />
        </Switch>
      </ConnectedRouter>
    </Pane>
  )
}

export default hot(App)
