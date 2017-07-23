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
      handleResetTracker: () => {},
      handleStartTracker: () => {},
      handleStopTracker: () => {},
      history: {
        push: () => {},
      },
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


  /*======================================
  =            Root Component            =
  ======================================*/

  it('should render with <li /> as root component', () => {
    const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)
    const isRenderedWithLi = wrapper.is('li')
    const isRenderedWithStyledLi = wrapper.dive().is('li')

    expect(isRenderedWithLi || isRenderedWithStyledLi).to.equal(true)
  })


  /*=========================================
  =            Edit Routine Link            =
  =========================================*/

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


  /*=====================================
  =            Routine Infos            =
  =====================================*/

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
    context('when timeLeft prop is not passed', () => {
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
    })

    context('when timeLeft prop is passed', () => {
      it('should render the timeLeft', () => {
        const duration = moment('12:34:56', 'HH:mm:ss')
        const timeLeft = moment('11:11:11', 'HH:mm:ss')
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: '123',
          routineName: 'The Routine',
          duration,
          timeLeft,
        })} />)
        const formattedTimeLeft = timeLeft.format(timeLeft.creationData().format)

        expect(wrapper).to.contain(formattedTimeLeft)
      })

      it('should not render the duration', () => {
        const duration = moment('12:34:56', 'HH:mm:ss')
        const timeLeft = moment('11:11:11', 'HH:mm:ss')
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: '123',
          routineName: 'The Routine',
          duration,
          timeLeft,
        })} />)
        const formattedDuration = duration.format(duration.creationData().format)

        expect(wrapper).to.not.contain(formattedDuration)
      })
    })
  })

  /*========================================
  =            Routine Controls            =
  ========================================*/
  /* FIXME: double check all nesting specs regarding the conditional rendering */

  describe('the Routine Controls', () => {
    /*==============================================
    =            'Start Tracker' Button            =
    ==============================================*/

    describe('the \'start tracker\' button', () => {
      context('when duration prop is passed', () => {
        context('when isTracking prop is not set to true', () => {
          it('should render a \'start tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
            })} />)

            expect(wrapper).to.have.exactly(1).descendants('.start-tracker')
          })
        })

        context('when isTracking prop is set to true', () => {
          it('should NOT render a \'start tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
              isTracking: true
            })} />)

            expect(wrapper).to.have.exactly(0).descendants('.start-tracker')
          })
        })
      })

      context('when duration prop is not passed', () => {
        it('should NOT render a \'start tracker\' button', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)

          expect(wrapper).to.have.exactly(0).descendants('.start-tracker')
        })
      })

      context('when clicked', () => {
        it('should call the passed handleStartTracker() with routine id', () => {
          const handleStartTracker = td.function()
          const passedId = '123'
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: passedId,
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            handleStartTracker,
          })} />)
          const trackerLink = wrapper.find('.start-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'start-tracker',
            }
          }

          const expectedArg = passedId

          td.verify(handleStartTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStartTracker(expectedArg), { times: 1 })
        })
      })
    })


    /*=============================================
    =            'Stop Tracker' Button            =
    =============================================*/

    describe('the \'stop tracker\' button', () => {
      context('when duration prop is passed', () => {
        context('when isTracking prop is set to true', () => {
          it('should render a \'stop tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
              isTracking: true
            })} />)

            expect(wrapper).to.have.exactly(1).descendants('.stop-tracker')
          })
        })

        context('when isTracking prop is not set to true', () => {
          it('should NOT render a \'stop tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
            })} />)

            expect(wrapper).to.have.exactly(0).descendants('.stop-tracker')
          })
        })
      })

      context('when clicked', () => {
        it('should call the passed handleStopTracker()', () => {
          const handleStopTracker = td.function()
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            handleStopTracker,
            isTracking: true
          })} />)
          const trackerLink = wrapper.find('.stop-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'stop-tracker',
            }
          }

          td.verify(handleStopTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStopTracker(), { times: 1 })
        })
      })
    })

    /*============================================
    =            Reset Tracker Button            =
    ============================================*/

    describe.skip('the \'reset tracker\' button', () => {
      context('when there is timeLeft prop and it differs from duration prop', () => {
        it('should render the \'reset tracker\' button', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            duration: moment('12:34:56', 'HH:mm:ss'),
          })} />)

          expect(wrapper).to.have.exactly(1).descendants('.reset-tracker')
        })
      })

      context('when there is no duration prop', () => {
        it('should not render')
      })

      context('when there is duration but no timeLeft prop', () => {
        it('should not render')
      })

      context('when there are duration and timeLeft prop but they are just the same', () => {
        it('should not render')
      })

      context('when clicked', () => {
        it('should call handleResetTracker() prop with routineId', () => {
          const handleResetTracker = td.function()
          const passedId = '123'
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: passedId,
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            handleResetTracker,
          })} />)
          const trackerLink = wrapper.find('.reset-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'reset-tracker',
            }
          }

          const expectedArg = passedId

          td.verify(handleResetTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleResetTracker(expectedArg), { times: 1 })
        })

        /*it('should call handleStopTracker() prop if isTracking prop is true', () => {
          const handleStopTracker = td.function()
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            isTracking: true,
            handleStopTracker,
          })} />)
          const trackerLink = wrapper.find('.reset-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'reset-tracker',
            }
          }

          td.verify(handleStopTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStopTracker(), { times: 1 })
        })*/

        /*it('should call NOT handleStopTracker() prop if isTracking prop is not true', () => {
          const handleStopTracker = td.function()
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            handleStopTracker,
          })} />)
          const trackerLink = wrapper.find('.reset-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'reset-tracker',
            }
          }

          td.verify(handleStopTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStopTracker(), { times: 0, ignoreExtraArgs: 0 })
        })*/
      })
    })

  })
})
