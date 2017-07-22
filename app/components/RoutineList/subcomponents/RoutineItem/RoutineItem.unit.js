import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import td from 'testdouble'
import moment from 'moment'
import lolex from 'lolex'

import { PureRoutineItem as RoutineItem } from './RoutineItem'

describe('COMPONENT: RoutineList/RoutineItem', () => {
  let clock, tick
  const getRequiredProps = props => Object.assign(
    {
      id: '123',
      routineName: 'Fallback Routine Name',
      history: {
        push: () => {},
      },
      handleEditRoutine: () => {},
    },
    props,
  )

  before(() => {
    clock = lolex.install()
    tick = (durationInStrFormat) => {
      const durationInMilli = moment.duration(durationInStrFormat).asMilliseconds()
      clock.tick(durationInMilli)
    }
  })

  after(() => {
    clock.uninstall
    td.reset()
  })

  it('should render with <li /> as root component', () => {
    const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)
    const isRenderedWithLi = wrapper.is('li')
    const isRenderedWithStyledLi = wrapper.dive().is('li')

    expect(isRenderedWithLi || isRenderedWithStyledLi).to.equal(true)
  })

  it('should render an element that calls the history.push() prop with the routine\'s editing page URL when clicked', () => {
    const push = td.function()
    const passsedId = '123'
    const wrapper = shallow(<RoutineItem {...getRequiredProps({ id: passsedId })} />)
    const getEditRoutineLink = () => wrapper.find('.edit-routine')
    const wantedUrlArg = '/routines/' + passsedId

    wrapper.setProps({ history: { push }})

    td.verify(push(), { times: 0, ignoreExtraArgs: true })
    getEditRoutineLink().prop('onClick')()
    td.verify(push(wantedUrlArg), { times: 1 })
  })

  it('should render the routine name', () => {
    const routineName = 'The Routine'
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '123',
      routineName: routineName,
    })} />)

    expect(wrapper).to.contain(routineName)
  })

  it('should render the reminder, if any', () => {
    const reminder = moment('00:00 am', 'h:mm a')
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '123',
      routineName: 'The Routine',
      reminder: reminder,
    })} />)
    const formattedReminder = reminder.format(reminder.creationData().format)

    expect(wrapper).to.contain(formattedReminder)
  })

  context('when duration prop is passed', () => {
    it('should render the duration', () => {
      const duration = moment('12:34:56', 'HH:mm:ss')
      const wrapper = shallow(<RoutineItem {...getRequiredProps({
        id: '123',
        routineName: 'The Routine',
        duration: duration,
      })} />)
      const formattedDuration = duration.format(duration.creationData().format)

      expect(wrapper).to.contain(formattedDuration)
    })

    it('should render a \'start tracker\' link', () => {
      const wrapper = shallow(<RoutineItem {...getRequiredProps({
        duration: moment('12:34:56', 'HH:mm:ss'),
      })} />)

      expect(wrapper).to.have.exactly(1).descendants('.toggle-tracker')
    })

    context('when \'start tracker\' link is clicked', () => {
      it('should call the passed handleEditRoutine() with the correct argument', () => {
        const handleEditRoutine = td.function()
        const passedId = '123'
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: passedId,
          routineName: 'The Routine',
          duration: moment('12:34:56', 'HH:mm:ss'),
          handleEditRoutine,
        })} />)
        const trackerLink = wrapper.find('.toggle-tracker')
        const fakeEv = { preventDefault: () => {}, stopPropagation: () => {} }
        const expectedArg = {
          id: passedId,
          isTracked: true,
        }

        td.verify(handleEditRoutine(), { times: 0, ignoreExtraArgs: 0 })
        trackerLink.prop('onClick')(fakeEv)
        td.verify(handleEditRoutine(expectedArg), { times: 1 })
      })

      /* it('should start decreasing the shown duration every second', () => {
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: '123',
          routineName: 'The Routine',
          duration: moment('12:30:30', 'HH:mm:ss'),
        })} />)
        const trackerLink = wrapper.find('.toggle-tracker')
        const fakeEv = { preventDefault: () => {}, stopPropagation: () => {} }
        const getDuration = () => wrapper.find('.duration').text()

        trackerLink.prop('onClick')(fakeEv)
        expect(getDuration()).to.equal('12:30:30')
        tick('00:00:15')
        expect(getDuration()).to.equal('12:30:15')
        tick('01:30:15')
        expect(getDuration()).to.equal('11:00:00')
      }) */
    })
  })

  context('when unmounted (while tracker is running)', () => {
    context('when isTracked prop is set to true', () => {
      /* it('should call the handleEditRoutine() prop with the correct argument', () => {
        // continue here
        // FIXME: lolex seems to makes testing slow
        const handleEditRoutine = td.function()
        const passedId = '123'
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: passedId,
          routineName: 'The Routine',
          duration: moment('12:34:56', 'HH:mm:ss'),
          handleEditRoutine,
        })} />)
        const expectedArg = {
          id: passedId,
          trackerDisruptionTime: new Date(),
        }


        td.verify(handleEditRoutine(), { times: 0, ignoreExtraArgs: 0 })
        wrapper.unmount()
        td.verify(handleEditRoutine(expectedArg), { times: 1 })
      }) */
    })

    context('when isTracked prop is not set to true', () => {
      it('should not call the editRoutine()')
    })
  })

  context('when mounted, routine data has trackerDisruptionTime, and the routine data\'s isTracked is set to true', () => {
    it('should continue the tracker with the time difference between present and trackerDisruptionTime in consideration')
  })
})
