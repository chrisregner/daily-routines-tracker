import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import NotFound from './NotFound'

describe('<NotFound />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<NotFound />)
    expect(wrapper).to.be.present()
  })
})