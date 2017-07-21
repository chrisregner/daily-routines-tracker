import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from './App'

describe('<App />', () => {
  it('should render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })

  describe('its subcomponents/routes', () => {
    it('should have the \'Home page\' route')
    it('should have the \'Add New Routine\' route')
    it('should have the \'Edit Routine\' route')
  })
})
