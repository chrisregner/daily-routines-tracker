import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from './App'

describe('COMPONENT: App', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })
})

describe('pending', () => {
  it('each routine should persist the initial duration in routineForm and state')
  it('routineItem should show stop button if that routine is tracking')
})
