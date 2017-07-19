import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import Home from 'pages/Home'

let StyledDiv

const App = () => (<Router>
  <StyledDiv className='pa3'>
    {/*<Route exact path="/" component={Home}/>*/}
    <Route path="/routines/new" component={AddNewRoutineForm}/>
    <Route exact path="/" component={Home}/>
  </StyledDiv>
</Router>)

StyledDiv = styled.div`
  min-width: 310px;
`

export default App
