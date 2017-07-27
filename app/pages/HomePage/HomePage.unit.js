import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import HomePagePure from './HomePagePure'
import { resetAllRoutines } from 'duck/actions'

describe('PAGE: HomePage', () => {
  let HomePage
  const getMockStore = configureMockStore()
  const createInstance = (passedProps) => {
    const initialState = { routines: [] }
    const requiredProps = {
      store: getMockStore(initialState),
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(
      <MemoryRouter>
        <HomePage {...finalProps} />
      </MemoryRouter>
    )
      .find(HomePage)
  }

  beforeEach(() => {
    HomePage = require('./HomePage').default
  })

  afterEach(() => { td.reset() })

  it('should render <HomePagePure /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(HomePagePure)
  })

  describe('the rendered <HomePagePure />', () => {
    describe('handlers {} prop', () => {
      it('should be an object passed to <RoutineList />', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent.prop('handlers')).to.be.an('object')
      })

      it('should have the handleResetAllRoutines() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleResetAllRoutines

        expect(subj).to.be.a('function')
      })

      describe('handleResetAllRoutines()', () => {
        it('should call dispatch() with resetAllRoutines()\'s result when called', () => {
          const resetAllRoutines = td.function()
          td.replace('duck/actions', { resetAllRoutines })
          const resetAllRoutinesRes = '123'
          td.when(resetAllRoutines()).thenReturn(resetAllRoutinesRes)

          HomePage = require('./HomePage').default

          const initialState = { routines: [] }
          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleResetAllRoutines()
          td.verify(dispatch(resetAllRoutinesRes), { times: 1 })
        })
      })
    })

  })
})
