import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'
import App from './App'

chai.use(chaiEnzyme())

describe('<App />', () => {
  it('renders', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })

  it('is a div', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.have.tagName('div')
  })
})
