import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Vip from './vip'
import About from './about'
import Detect from './detect.js'
import './styles.css'

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={About} />
        <Route path="/about" component={About} />
        <Route path="/detect" component={Detect} />
        <Route path="/vip" component={Vip} />
      </div>
    </Router>
  )
}
