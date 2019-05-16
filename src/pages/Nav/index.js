import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { AppBar, Toolbar, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { navList } from './routes'

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary[50],
    marginRight: theme.spacing(1)
  }
}))

function Nav (props) {
  const classes = useStyles()
  const { router } = props
  const { pathname } = router.location

  return (
    <AppBar position="static">
      <Toolbar>
        {
          navList.map(nav => (
            <Button
              variant={pathname === nav.path ? 'contained' : null}
              color="primary"
              className={classes.button}
              key={nav.path}
              component={Link}
              to={nav.path}>{nav.label}
            </Button>
          ))
        }
      </Toolbar>
    </AppBar>
  )
}

export default connect(state => ({ router: state.router }), {})(Nav)
