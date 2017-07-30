import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'
import moment from 'moment'
import lolex from 'lolex'

describe('Container: DataPersistor', () => {
  let PureDataPersistor, DataPersistor, fakeClock
  const createMockStore = configureMockStore()
  const createInstance = (passedProps, shouldUsePure) => {
    const mockStore = createMockStore()
    const requiredPropsForPure = {
      state: {
        routines: [],
      },
      handleStartTracker: () => {},
    }

    const requiredProps = shouldUsePure
      ? requiredPropsForPure
      : {
          store: createMockStore(requiredPropsForPure.state)
        }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    if (shouldUsePure)
      return shallow(<PureDataPersistor {...finalProps} />)

    return shallow(<DataPersistor {...finalProps} />)
  }

  beforeEach(() => {
    const myRequire = require('./DataPersistor')

    PureDataPersistor = myRequire.PureDataPersistor
    DataPersistor = myRequire.default
  })

  afterEach(() => {
    td.reset()
    if (fakeClock && fakeClock.uninstall)
      fakeClock.uninstall()
  })

  it('should render without crashing', () => {
    const wrapper = createInstance()
    expect(wrapper).to.be.present()
  })

  it('should have the correct state prop', () => {
    const initialState = {
      routines: [{
        id: 'myUniqueRoutineId',
        routineName: 'myUniqueRoutineName',
      }]
    }
    const passedProps = {
      store: createMockStore(initialState)
    }
    const wrapper = createInstance(passedProps)

    expect(wrapper).to.have.prop('state', initialState)
  })

  it('should add its method handleTabClose() as \'beforeunload\' event listener on mount', () => {
    const fakeAddEventListener = td.replace(window, 'addEventListener')
    const wrapper = createInstance(undefined, true)
    td.verify(fakeAddEventListener(), { times: 0, ignoreExtraArgs: true })
    wrapper.instance().componentDidMount()
    td.verify(fakeAddEventListener('beforeunload', wrapper.instance().handleTabClose), { times: 1 })
  })

  it('should remove its method handleTabClose() as \'beforeunload\' event listener on unmount', () => {
    const FakeRemoveEventListener = td.replace(window, 'removeEventListener')
    const wrapper = createInstance(undefined, true)
    td.verify(FakeRemoveEventListener(), { times: 0, ignoreExtraArgs: true })
    wrapper.instance().componentWillUnmount()
    td.verify(FakeRemoveEventListener('beforeunload', wrapper.instance().handleTabClose), { times: 1 })
  })

  describe('handleTabClose() method', () => {
    it('should call windows.localStorage.setItem() twice with the correct arguments', () => {
      const fakeClock = lolex.install()
      const origLocalStorage = window.localStorage
      const fakeSetItem = td.function()
      window.localStorage = { setItem: fakeSetItem }

      const passedProp = {
        state: {
          routines: [{
            id: '1',
            routineName: 'The Routine',
          }]
        }
      }
      const wrapper = createInstance(passedProp, true)
      const fakeEv = { preventDefault: () => {} }

      td.verify(fakeSetItem(), { times: 0, ignoreExtraArgs: true })
      wrapper.instance().handleTabClose(fakeEv)

      const expectedArg1 = ['state', JSON.stringify(passedProp.state)]
      const expectedArg2 = ['timeLastOpen', moment().toJSON()]

      td.verify(fakeSetItem(...expectedArg1), { times: 1 })
      td.verify(fakeSetItem(...expectedArg2), { times: 1 })
      td.verify(fakeSetItem(), { times: 2, ignoreExtraArgs: true })

      // teardown
      window.localStorage = origLocalStorage
    })
  })

  context('when there is a routine tracking according to state on mount', () => {
    it('should call the handleStartTracker() prop with the tracking routine\'s id', () => {
      const fakeHandleStartTracker = td.function()

      const passedProp = {
        handleStartTracker: fakeHandleStartTracker,
        state: {
          routines: [
            {
              id: '1',
              routineName: 'The Routine',
            },
            {
              id: '2',
              routineName: 'The Tracking Routine',
              duration: moment(),
              isTracking: true,
            }
          ]
        }
      }

      const wrapper = createInstance(passedProp, true)

      td.verify(fakeHandleStartTracker(), { times: 0, ignoreExtraArgs: true })
      wrapper.instance().componentDidMount()

      const expectedArg = '2'
      td.verify(fakeHandleStartTracker(expectedArg), { times: 1 })
    })
  })

  context('when there is NO routine tracking according to state on mount', () => {
    it('should NOT call the handleStartTracker() prop', () => {
      const fakeHandleStartTracker = td.function()

      const passedProp = {
        handleStartTracker: fakeHandleStartTracker,
        state: {
          routines: [
            {
              id: '1',
              routineName: 'The Routine',
            },
            {
              id: '2',
              routineName: 'The Tracking Routine',
              duration: moment(),
            }
          ]
        }
      }

      const wrapper = createInstance(passedProp, true)

      wrapper.instance().componentDidMount()
      td.verify(fakeHandleStartTracker(), { times: 0, ignoreExtraArgs: true })
    })
  })

  describe('handleStartTracker() prop', () => {
    it('should call dispatch() with startTracker()\'s result when called with handleStartTracker\'s first argument', () => {
      const fakeStartTracker = td.function()
      td.replace('duck/actions', { startTracker: fakeStartTracker })
      const startTrackerArg = 'startTrackerArg'
      const startTrackerRes = 'startTrackerRes'
      td.when(fakeStartTracker(startTrackerArg)).thenReturn(startTrackerRes)

      const initialState = { routines: [] }
      const mockStore = createMockStore(initialState)
      const fakeDispatch = td.replace(mockStore, 'dispatch')

      DataPersistor = require('./DataPersistor').default

      const wrapper = createInstance({ store: mockStore })
      const passedArg = startTrackerArg

      td.verify(fakeDispatch(), { times: 0, ignoreExtraArgs: true })
      wrapper.prop('handleStartTracker')(startTrackerArg)
      td.verify(fakeDispatch(startTrackerRes), { times: 1 })
    })
  })
})