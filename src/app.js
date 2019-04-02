import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import HelloWorld from './pages/HelloWorld'
import Counter from './pages/Counter'

function App () {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Hello World</Link>
            </li>
            <li>
              <Link to="/counter">Counter</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={HelloWorld} />
        <Route path="/counter" component={Counter} />
      </div>
    </Router>
  )
}

export default hot(App)
