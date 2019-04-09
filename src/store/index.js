import { init } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import createLoadingPlugin from '@rematch/loading'

import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import * as models from '../models'

const immer = immerPlugin()
const loading = createLoadingPlugin({})

export const history = createBrowserHistory()
const reducers = { router: connectRouter(history) }

const store = init({
  models,
  plugins: [immer, loading],
  redux: {
    middlewares: [routerMiddleware(history)],
    reducers
  }
})

export default store
