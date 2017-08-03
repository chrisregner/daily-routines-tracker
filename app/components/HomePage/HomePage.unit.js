import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import merge from 'lodash/merge'

import HomePage from './HomePage'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'
import ActionBarContainer from 'containers/ActionBarContainer'

describe('Page: HomePage', () => {
  const getRequiredProps = (passedProps) => {
    const requiredProps = {
      handlers: {
        handleResetAllRoutines: () => {},
      },
    }

    return passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps
  }

  after(() => {
    document.title = ''
  })

  it('should render without crashing', () => {
    const wrapper = shallow(<HomePage {...getRequiredProps()} />)
    expect(wrapper).to.be.present()
  })

  it('should set the page title on mount', () => {
    expect(document.title).to.not.equal('Daily Routines Tracker')
    const wrapper = shallow(<HomePage {...getRequiredProps()} />)
    wrapper.instance().componentDidMount()
    expect(document.title).to.equal('Daily Routines Tracker')
  })

  it('should render a <PopulatedRoutineList />', () => {
    const wrapper = shallow(<HomePage {...getRequiredProps()} />)
    expect(wrapper).to.have.exactly(1).descendants(PopulatedRoutineList)
  })

  it('should render an <ActionBarContainer />', () => {
    const wrapper = shallow(<HomePage {...getRequiredProps()} />)
    expect(wrapper).to.have.exactly(1).descendants(ActionBarContainer)
  })
})
