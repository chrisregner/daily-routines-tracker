import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
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
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <s.MasterContainer className='bg-moon-gray vh-100'>
        <s.Container className='center h-100'>
          <div className='w-100 h-100 bg-white overflow-auto'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/routines/new' component={AddNewRoutineForm} />
              <Route path='/routines/:id' component={EditRoutineForm} />
              <Route path='*' component={NotFound} />
            </Switch>
            <DoneRoutinesNotifier />
            <DataPersistor />
            <s.Footer className='fixed bottom-0 silver'>
              <div className='relative flex items-center pa3 bg-white-80'>
                <div className='self-grow-1'>
                  By <s.A className='silver underline' href='https://github.com/chrisregner/'>Chris Regner</s.A>. View <s.A className='silver underline' href='https://github.com/chrisregner/daily-routines-tracker'>source</s.A>.
                </div>
                <div className='pa2 bg-white-80'>
                  <s.AddNewRoutineBtnContainer>
                    <Route exact path='/' render={() => (
                      <Link to='/routines/new'>
                        <Button type='primary' size='large' icon='plus' shape='circle' />
                      </Link>
                    )} />
                  </s.AddNewRoutineBtnContainer>
                </div>
              </div>
            </s.Footer>
          </div>
        </s.Container>
      </s.MasterContainer>
    </BrowserRouter>
  )
}

s = {
  MasterContainer: styled.div`
    @media screen and (min-width: 509px) {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media screen and (min-width: 481px) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  `,
  AddNewRoutineBtnContainer: styled.div`
    min-height: 32px;
    min-width: 1px;
  `,
  Footer: styled.footer`
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    min-width: 310px;
    max-width: 480px;

    @media screen and (min-width: 481px) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  `,
  Container: styled.div`
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
