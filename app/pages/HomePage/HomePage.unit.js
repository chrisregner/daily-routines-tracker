import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'

import HomePage from './HomePage'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'

describe('<HomePage />', () => {
  it('should have <div /> as its root component', () => {
    const wrapper = shallow(<HomePage />)
    expect(wrapper).to.match('div')
  })

  it('should render a PopulatedRoutineList', () => {
    const wrapper = shallow(<HomePage />)
    expect(wrapper).to.containMatchingElement(<PopulatedRoutineList />)
    expect(wrapper).to.have.exactly(1).descendants(PopulatedRoutineList)
  })

  it('should render a react router Link to the page for adding new routine', () => {
    const wrapper = shallow(<HomePage />)
    const wantedLinkElement = wrapper.findWhere(wrpr => (
      wrpr.is(Link) &&
      wrpr.prop('to') === 'routines/new')
    )
    expect(wantedLinkElement).to.have.lengthOf(1)
  })
})
