import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Pane, Tablist, Tab } from 'evergreen-ui'

import Home from './pages/Home'
import ImageKiller from './pages/ImageKiller'

function App () {
  return (
    <Pane>
      <Router>
        <Pane elevation={2} padding={8} marginBottom={16}>
          <Tablist flexBasis={240}>
            <Tab><Link to="/">主页</Link></Tab>
            <Tab><Link to="/imageKiller">图片处理</Link></Tab>
          </Tablist>
        </Pane>

        <Route path="/" exact component={Home} />
        <Route path="/imageKiller" component={ImageKiller} />
      </Router>
    </Pane>
  )
}

export default hot(App)
