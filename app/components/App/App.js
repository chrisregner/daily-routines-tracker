import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import HomePage from 'components/HomePage'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'
import DoneRoutinesNotifier from 'containers/DoneRoutinesNotifier'
import DataPersistor from 'containers/DataPersistor'

let StyledDiv

class App extends React.Component {
  render = () => (
    <StyledDiv>
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/routines/new' component={AddNewRoutineForm} />
            <Route path='/routines/:id' component={EditRoutineForm} />
          </Switch>
        </Router>
      <DoneRoutinesNotifier />
      <DataPersistor />
    </StyledDiv>
  )
}

StyledDiv = styled.div`
  min-width: 310px
`

export default App
