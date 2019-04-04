import React, { Component } from 'react'
import { Pane, Button } from 'evergreen-ui'
import { connect } from 'react-redux'

@connect(state => ({
  count: state.count
}),
  ({ count: { increment, decrement } }) => ({
    increment: () => increment(1),
    decrement: () => decrement(1),
  })
)
export default class ArticleGuard extends Component {
  render() {
    const { count, increment, decrement } = this.props
    console.log(this.props)
    return (
      <Pane>
        Article Guard
        {count}
        <Button onClick={increment}>增加</Button>
        <Button onClick={decrement}>减少</Button>
      </Pane>
    )
  }
}
