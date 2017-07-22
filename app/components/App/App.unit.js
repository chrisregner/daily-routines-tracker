import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from './App'

describe('<App />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })
})
