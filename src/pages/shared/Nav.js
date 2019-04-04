import React from 'react'
import { Link } from 'react-router-dom'
import { Pane, Tablist, Tab } from 'evergreen-ui'

export default function () {
  return (<Pane elevation={2} padding={8} marginBottom={16}>
    <Tablist flexBasis={240}>
      <Tab><Link to="/">主页</Link></Tab>
      <Tab><Link to="/imageKiller">图片</Link></Tab>
      <Tab><Link to="/articleGuard">文章</Link></Tab>
    </Tablist>
  </Pane>)
}
