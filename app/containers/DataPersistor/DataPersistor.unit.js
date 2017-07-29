import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import DataPersistor, { PureDataPersistor } from './DataPersistor'

describe('Container: DataPersistor', () => {
  const createMockStore = configureMockStore()
  const createInstance = (passedProps, shouldUsePure) => {
    const mockStore = createMockStore()
    const requiredProps = shouldUsePure
      ? {
        state: {},
      }
      : {
          store: createMockStore()
        }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    if (shouldUsePure)
      return shallow(<PureDataPersistor {...finalProps} />)

    return shallow(<DataPersistor {...finalProps} />)
  }

  /* beforeEach(() => {
    const myRequire = require('./DataPersistor')

    PureDataPersistor = myRequire.PureDataPersistor
    DataPersistor = myRequire.default
  }) */

  afterEach(() => { td.reset() })

  it('should render without crashing', () => {
    const wrapper = createInstance()
    expect(wrapper).to.be.present()
  })

  it('should have the correct state prop', () => {
    const initialState = { myUniqueObjKey: 'myUniqueObjVal' }
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
    it('should call windows.localStorage.setItem() with the correct arguments', () => {
      const origLocalStorage = window.localStorage
      const fakeSetItem = td.function()
      window.localStorage = { setItem: fakeSetItem }

      const passedProp = {
        state: {
          routines: [{
            id: '1',
            routineName: 'The Routine',
            duration: new Date(),
          }]
        }
      }
      const wrapper = createInstance(passedProp, true)
      const fakeEv = { preventDefault: () => {} }

      td.verify(fakeSetItem(), { times: 0, ignoreExtraArgs: true })
      wrapper.instance().handleTabClose(fakeEv)
      td.verify(fakeSetItem('state', JSON.stringify(passedProp.state)), { times: 1, ignoreExtraArgs: true })
      td.verify(fakeSetItem('timeClosed', new Date()), { times: 1, ignoreExtraArgs: true })

      // teardown
      window.localStorage = origLocalStorage
    })
  })
})