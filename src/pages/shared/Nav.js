import React, { Component } from 'react'
import { Pane, Tablist, Tab } from 'evergreen-ui'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'

@connect()
export default class Nav extends Component {

  handleLink = (route) => {
    this.props.dispatch(push(route))
  }
  render() {
    console.log(this.props)
    return (<Pane elevation={2} padding={8} marginBottom={16}>
      <Tablist flexBasis={240} >
        <Tab is="a" onClick={() => this.handleLink('/')}>主页</Tab>
        <Tab is="a" onClick={() => this.handleLink('/imageKiller')}>图片</Tab>
        <Tab is="a" onClick={() => this.handleLink('/articleGuard')} >文章</Tab>
      </Tablist>
    </Pane>)
  }
}
