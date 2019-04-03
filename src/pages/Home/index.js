import React from 'react'
import { Pane, Heading } from 'evergreen-ui'

export default function HelloWorld () {
  return (
    <Pane
      width={'100%'}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Hello 👋</Heading>
    </Pane>
  )
}
