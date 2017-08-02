import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore from 'redux-mock-store'

import RoutineForm from 'components/RoutineForm'

describe('CONTAINER: AddNewRoutineForm', () => {
  let AddNewRoutineForm
  const mockStore = configureMockStore()()
  const spies = {
    push: td.function(),
  }

  const createInstance = () => (
    shallow(
      <MemoryRouter>
        <AddNewRoutineForm
          store={mockStore}
          history={{ push: spies.push }}
        />
      </MemoryRouter>
    )
      .find(AddNewRoutineForm)
  )

  beforeEach(() => {
    AddNewRoutineForm = require('./AddNewRoutineForm').default
  })

  afterEach(() => { td.reset() })

  it('should render <RoutineForm /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(RoutineForm)
  })

  it('should receive a handleSubmit() prop', () => {
    const wrapper = createInstance()
    expect(wrapper.dive().prop('handleSubmit')).to.be.a('function')
  })

  describe('the passed handleSubmit() prop', () => {
    it('should dispatch the action created by calling addRoutine() with handleSubmit()\'s argument', () => {
      const addRoutineArg = 'addRoutineArg'
      const addRoutineRes = 'addRoutineRes'
      const addRoutine = td.function()
      const dispatch = td.replace(mockStore, 'dispatch')
      td.replace('duck/actions', { addRoutine })
      td.when(addRoutine(addRoutineArg)).thenReturn(addRoutineRes)
      AddNewRoutineForm = require('./AddNewRoutineForm').default

      const wrapper = createInstance()
      const wrappedComponent = wrapper.dive()
      td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
      wrappedComponent.prop('handleSubmit')(addRoutineArg)

      td.verify(dispatch(addRoutineRes), { times: 1 })
    })

    it('should redirect to path \'/\' after calling the dispatch', () => {
      const wrapper = createInstance()
      const wrappedComponent = wrapper.dive()

      td.verify(spies.push(), { times: 0, ignoreExtraArgs: true })
      wrappedComponent.prop('handleSubmit')()

      td.verify(spies.push('/'), { times: 1 })
    })
  })
})
