import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import RoutineList from 'components/RoutineList'
import { startTracker } from 'duck/actions'

describe('CONTAINER: PopulatedRoutineList', () => {
  let PopulatedRoutineList
  const getMockStore = configureMockStore()
  const createInstance = (passedProps) => {
    const initialState = {
      isSorting: false,
      routines: []
    }
    const requiredProps = {
      store: getMockStore(initialState),
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(
      <MemoryRouter>
        <PopulatedRoutineList {...finalProps} />
      </MemoryRouter>
    )
      .find(PopulatedRoutineList)
  }

  beforeEach(() => {
    PopulatedRoutineList = require('./PopulatedRoutineList').default
  })

  afterEach(() => { td.reset() })

  it('should render <RoutineList /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(RoutineList)
  })

  describe('the rendered <RoutineList />', () => {
    it('should receive the routines from state as props', () => {
      const testSpecWithRoutines = (routines) => {
        const initialState = {
          routines,
          isSorting: false,
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('routines', routines)
      }

      testSpecWithRoutines([])
      testSpecWithRoutines([
        { id: '123' },
        { id: '456' },
        { id: '143' },
      ])
    })

    it('should receive isSorting from state as prop', () => {
      const testWithIsSortingSetTo = (isSorting) => {
        const initialState = {
          routines: [],
          isSorting: isSorting,
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('isSorting', isSorting)
      }

      testWithIsSortingSetTo(true)
      testWithIsSortingSetTo(false)
    })

    describe('handlers {} prop', () => {
      it('should be an object passed to <RoutineList />', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent.prop('handlers')).to.be.an('object')
      })

      it('should have the handleStartTracker() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subject = wrappedComponent.prop('handlers').handleStartTracker

        expect(subject).to.be.a('function')
      })

      describe('handleStartTracker()', () => {
        it('should call dispatch() with startTracker()\'s result when called with handleStartTracker\'s first argument', () => {
          const startTracker = td.function()
          td.replace('duck/actions', { startTracker })
          const startTrackerArg = '123'
          const startTrackerRes = '456'
          td.when(startTracker(startTrackerArg)).thenReturn(startTrackerRes)

          PopulatedRoutineList = require('./PopulatedRoutineList').default

          const initialState = {
            routines: [],
            isSorting: false
          }

          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()
          const passedArg = startTrackerArg

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleStartTracker(startTrackerArg)
          td.verify(dispatch(startTrackerRes), { times: 1 })
        })
      })

      it('should have the handleStopTracker() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleStopTracker

        expect(subj).to.be.a('function')
      })

      describe('handleStopTracker()', () => {
        it('should call dispatch() with stopTracker()\'s result when called', () => {
          const stopTracker = td.function()
          td.replace('duck/actions', { stopTracker })
          const stopTrackerRes = '123'
          td.when(stopTracker()).thenReturn(stopTrackerRes)

          PopulatedRoutineList = require('./PopulatedRoutineList').default

          const initialState = {
            routines: [],
            isSorting: false
          }

          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleStopTracker()
          td.verify(dispatch(stopTrackerRes), { times: 1 })
        })
      })

      it('should have the handleResetTracker() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleResetTracker

        expect(subj).to.be.a('function')
      })

      describe('handleResetTracker()', () => {
        it('should call dispatch() with resetTracker()\'s result when called with handleResetTracker\'s first argument', () => {
          const resetTracker = td.function()
          td.replace('duck/actions', { resetTracker })
          const resetTrackerArg = '123'
          const resetTrackerRes = '456'
          td.when(resetTracker(resetTrackerArg)).thenReturn(resetTrackerRes)

          PopulatedRoutineList = require('./PopulatedRoutineList').default

          const initialState = {
            routines: [],
            isSorting: false
          }

          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()
          const passedArg = resetTrackerArg

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleResetTracker(resetTrackerArg)
          td.verify(dispatch(resetTrackerRes), { times: 1 })
        })
      })

      it('should have the handleSetRoutines() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleSetRoutines

        expect(subj).to.be.a('function')
      })

      describe('handleSetRoutines()', () => {
        it('should call dispatch() with setRoutines()\'s result when called with handleSetRoutines\'s first argument', () => {
          const setRoutines = td.function()
          td.replace('duck/actions', { setRoutines })
          const setRoutinesArg = '123'
          const setRoutinesRes = '456'
          td.when(setRoutines(setRoutinesArg)).thenReturn(setRoutinesRes)

          PopulatedRoutineList = require('./PopulatedRoutineList').default

          const initialState = {
            routines: [],
            isSorting: false
          }

          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()
          const passedArg = setRoutinesArg

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleSetRoutines(setRoutinesArg)
          td.verify(dispatch(setRoutinesRes), { times: 1 })
        })
      })
    })

  })
})
