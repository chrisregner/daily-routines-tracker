import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import moment from 'moment'

import RoutineItem from './RoutineItem'

describe('<RoutineItem />', () => {
  const getRequiredProps = props => Object.assign(
    { id: '1', routineName: 'Fallback Routine Name' },
    props,
  )

  it('should render with <li /> as root component', () => {
    const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)
    const isRenderedWithLi = wrapper.is('li')
    const isRenderedWithStyledLi = wrapper.dive().is('li')

    expect(isRenderedWithLi || isRenderedWithStyledLi).to.equal(true)
  })

  it('should render a react-router link that points routine\'s editing page', () => {
    const wrapper = shallow(<RoutineItem {...getRequiredProps({ id: '123' })} />)
    const wantedUrl = '/routines/123'
    const wantedElement = wrapper.findWhere((wrpr) => (
      wrpr.is(Link) &&
      wrpr.prop('to') === wantedUrl
    ))

    expect(wantedElement).to.have.lengthOf(1)
  })

  it('should render the routine name', () => {
    const routineName = 'The Routine'
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '1',
      routineName: routineName,
    })} />)

    expect(wrapper).to.contain(routineName)
  })

  it('should render the duration, if any', () => {
    const duration = moment('12:34:56', 'HH:mm:ss')
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '1',
      routineName: 'The Routine',
      duration: duration,
    })} />)
    const formattedDuration = duration.format(duration.creationData().format)

    expect(wrapper).to.contain(formattedDuration)
  })

  it('should render the reminder, if any', () => {
    const reminder = moment('00:00 am', 'h:mm a')
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '1',
      routineName: 'The Routine',
      reminder: reminder,
    })} />)
    const formattedReminder = reminder.format(reminder.creationData().format)

    expect(wrapper).to.contain(formattedReminder)
  })
})
