import { init } from '@rematch/core'
import immerPlugin from '@rematch/immer'

import * as models from '../models'

const immer = immerPlugin()

const store = init({
  models,
  plugins: [immer]
})

export default store
