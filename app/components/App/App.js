import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import HomePage from 'pages/HomePage'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'

let StyledDiv

const App = () => (<Router>
  <StyledDiv>
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route path='/routines/new' component={AddNewRoutineForm} />
      <Route path='/routines/:id' component={EditRoutineForm} />
    </Switch>
  </StyledDiv>
</Router>)

StyledDiv = styled.div`
  min-width: 310px;
`

export default App
