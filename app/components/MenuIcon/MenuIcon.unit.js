import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import MenuIcon from './MenuIcon'

describe('COMPONENT: MenuIcon', () => {
  it('should render', () => {
    const subj = shallow(<MenuIcon />)
    expect(subj).to.be.present()
  })
})
