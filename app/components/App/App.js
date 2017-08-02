import React from 'react'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import HomePage from 'components/HomePage'
import NotFound from 'components/NotFound'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'
import DoneRoutinesNotifier from 'containers/DoneRoutinesNotifier'
import DataPersistor from 'containers/DataPersistor'

import 'tachyons/css/tachyons.css'

let s

class App extends React.Component {
  render = () => (
    <div className='bg-moon-gray vh-100 pa3-ns'>
      <s.AppContainer className='relative center h-100'>
        <div className='w-100 h-100 bg-white overflow-auto'>
          <Router>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/routines/new' component={AddNewRoutineForm} />
              <Route path='/routines/:id' component={EditRoutineForm} />
              <Route path='*' component={NotFound} />
            </Switch>
          </Router>
          <DoneRoutinesNotifier />
          <DataPersistor />
          <div className={'absolute left-0 bottom-1 pa3 bg-white-80 gray'}>
            Created by <s.A className='gray underline' href='https://github.com/chrisregner/'>Chris Regner</s.A>
          </div>
        </div>
      </s.AppContainer>
    </div>
  )
}

s = {
  AppContainer: styled.div`
    min-width: 310px;
    max-width: 480px;
  `,
  A: styled.a`
    &:hover {
      text-decoration: underline;
    }
  `,
}

export default App
