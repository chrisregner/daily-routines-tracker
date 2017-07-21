import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import HomePage from 'pages/HomePage'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'

let StyledDiv

const App = () => (<Router>
  <StyledDiv className='pa3'>
    <Route exact path="/" component={HomePage}/>
    <Route path="/routines/:id" render={(props) => {
      if (props.match.params.id === 'new')
        return <AddNewRoutineForm {...props} />
      else
        return <EditRoutineForm {...props} />
    }}/>
  </StyledDiv>
</Router>)

StyledDiv = styled.div`
  min-width: 310px;
`

export default App
