import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

chai.use(chaiEnzyme())

describe.skip('<App />', () => {
  it('should render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })
})
