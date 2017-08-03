import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Switch,
  Link,
} from 'react-router-dom'

import HomePage from 'components/HomePage'
import NotFound from 'components/NotFound'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'
import DoneRoutinesNotifier from 'containers/DoneRoutinesNotifier'

import App from './App'

describe('COMPONENT: App', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })

  it('should have <BrowserRouter /> as root component', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.match(BrowserRouter)
  })

  it('should render the correct routes', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.containMatchingElement((
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/routines/new' component={AddNewRoutineForm} />
        <Route path='/routines/:id' component={EditRoutineForm} />
        <Route path='*' component={NotFound} />
      </Switch>
    ))
  })

  it('should render one <DoneRoutinesNotifier />', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.have.exactly(1).descendants(DoneRoutinesNotifier)
  })

  it('should render a react router Link to the page for adding new routine, that renders only on HomePage route', () => {
    const wrapper = shallow(<App />)
    const expectedComponent = wrapper.findWhere(wrpr => {
      if (wrpr.matchesElement(<Route exact path='/' />)) {
        const itsRender = wrpr.prop('render')
          && shallow(
            <MemoryRouter>
              {wrpr.prop('render')()}
            </MemoryRouter>
          )

        if (
          itsRender
          && itsRender.find(Link).length === 1
          && itsRender.find(Link).prop('to') === '/routines/new'
        )
          return true
      }

      return false
    })

    expect(expectedComponent).to.have.lengthOf(1)
  })
})
