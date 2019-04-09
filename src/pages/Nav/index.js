import React, { Component } from 'react'
import { Pane, Tablist, Tab } from 'evergreen-ui'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { navList } from './routes'

@connect(state => ({
  router: state.router
}))
export default class Nav extends Component {

  constructor(props) {
    super(props)
  }

  handleLink = (route) => {
    this.props.dispatch(push(route))
  }

  render() {
    const { router } = this.props
    const pathname = router.location.pathname

    return (<Pane elevation={2} padding={8} marginBottom={16}>
      <Tablist flexBasis={240} >
        {
          navList.map(nav => (
            <Tab onSelect={() => this.handleLink(nav.link)} isSelected={pathname === nav.link}>{nav.mean}</Tab>
          ))
        }
      </Tablist>
    </Pane>)
  }
}
