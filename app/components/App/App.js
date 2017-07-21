import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import HomePage from 'pages/HomePage'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'

let StyledDiv

const App = () => (<Router>
  <StyledDiv className='pa3'>
    <Route exact path='/' component={HomePage} />
    <Route path='/routines/:id' render={(routerProps) => {
      if (routerProps.match.params.id === 'new')
        return <AddNewRoutineForm {...routerProps} />
      else
        return <EditRoutineForm {...routerProps} />
    }} />
  </StyledDiv>
</Router>)

StyledDiv = styled.div`
  min-width: 310px;
`

export default App
