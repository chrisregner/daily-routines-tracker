import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'

import Home from './Home'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'

describe('<Home />', () => {
  it('should have <div /> as its root component', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper).to.match('div')
  })

  it('should render a PopulatedRoutineList', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper).to.containMatchingElement(<PopulatedRoutineList />)
    expect(wrapper).to.have.exactly(1).descendants(PopulatedRoutineList)
  })

  it('should render a react router Link to the page for adding new routine', () => {
    const wrapper = shallow(<Home />)
    const wantedLinkElement = wrapper.findWhere(wrpr => (
      wrpr.is(Link)
      && wrpr.prop('to') === 'routines/new')
    )
    expect(wantedLinkElement).to.have.lengthOf(1)
  })
})