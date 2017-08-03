import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import moment from 'moment'
import { Icon } from 'antd'

import * as actions from 'duck/actions'
import { PureRoutineItem as RoutineItem } from './RoutineItem'

describe('COMPONENT: RoutineList/RoutineItem', () => {
  const getRequiredProps = props => Object.assign(
    {
      id: '123',
      routineName: 'Fallback Routine Name',
      isSorting: false,
      handleResetTracker: () => {},
      handleStartTracker: () => {},
      handleStopTracker: () => {},
      handleMarkDone: () => {},
      history: {
        push: () => {},
      },
    },
    props,
  )

  after(() => {
    td.reset()
    clearInterval(actions.getLastIntervalId())
  })

  /* ==================================
  =            As a whole            =
  ================================== */

  it('should render without crashing', () => {
    const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)
    expect(wrapper).to.be.present()
  })

  /* =========================================
  =            Edit Routine Link            =
  ========================================= */

  it('should render an element that calls the history.push() prop with the routine\'s editing page URL when clicked', () => {
    const push = td.function()
    const passsedId = '123'
    const wrapper = shallow(<RoutineItem {...getRequiredProps({ id: passsedId })} />)
    const getEditRoutineLink = () => wrapper.find('.edit-routine')
    const wantedUrlArg = '/routines/' + passsedId

    wrapper.setProps({ history: { push } })

    td.verify(push(), { times: 0, ignoreExtraArgs: true })
    getEditRoutineLink().prop('onClick')()
    td.verify(push(wantedUrlArg), { times: 1 })
  })

  /* =====================================
  =            Routine Infos            =
  ===================================== */

  it('should render the routine name', () => {
    const routineName = 'The Routine'
    const wrapper = shallow(<RoutineItem {...getRequiredProps({
      id: '123',
      routineName: routineName,
    })} />)

    expect(wrapper).to.contain(routineName)
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

  /* ========================================
  =            Routine Controls            =
  ======================================== */
  /* FIXME: double check all nesting specs regarding the conditional rendering */

  describe('the Routine Controls', () => {
    /* ==============================================
    =            'Start Tracker' Button            =
    ============================================== */

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
              isTracking: true,
            })} />)

            expect(wrapper).to.have.exactly(0).descendants('.start-tracker')
          })
        })

        context('when is isDone is set to true', () => {
          it('should NOT render a \'start tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
              isDone: true,
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
            },
          }

          const expectedArg = passedId

          td.verify(handleStartTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStartTracker(expectedArg), { times: 1 })
        })
      })
    })

    /* =============================================
    =            'Stop Tracker' Button            =
    ============================================= */

    describe('the \'stop tracker\' button', () => {
      context('when duration prop is passed', () => {
        context('when isTracking prop is set to true', () => {
          it('should render a \'stop tracker\' button', () => {
            const wrapper = shallow(<RoutineItem {...getRequiredProps({
              duration: moment('12:34:56', 'HH:mm:ss'),
              isTracking: true,
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
            isTracking: true,
          })} />)
          const trackerLink = wrapper.find('.stop-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'stop-tracker',
            },
          }

          td.verify(handleStopTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleStopTracker(), { times: 1 })
        })
      })
    })

    /* ============================================
    =            Reset Routine Button            =
    ============================================ */

    describe('the \'reset tracker\' button', () => {
      context('when (duration) prop', () => {
        it('should not render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            duration: moment('12:34:56', 'HH:mm:ss'),
          })} />)

          expect(wrapper).to.have.exactly(0).descendants('.reset-tracker')
        })
      })

      context('when (duration && timeLeft) prop', () => {
        it('should render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            duration: moment('11:11:11', 'HH:mm:ss'),
            timeLeft: moment('11:11:11', 'HH:mm:ss'),
          })} />)

          expect(wrapper).to.have.exactly(1).descendants('.reset-tracker')
        })
      })

      context('when (duration && isDone) prop', () => {
        it('should render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            duration: moment('12:34:56', 'HH:mm:ss'),
            isDone: true,
          })} />)

          expect(wrapper).to.have.exactly(1).descendants('.reset-tracker')
        })
      })

      context('when (duration && isTracking) prop', () => {
        it('should render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            duration: moment('11:11:11', 'HH:mm:ss'),
            isTracking: true,
          })} />)

          expect(wrapper).to.have.exactly(1).descendants('.reset-tracker')
        })
      })

      context('when (isDone) prop', () => {
        it('should render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            isDone: true,
          })} />)

          expect(wrapper).to.have.exactly(1).descendants('.reset-tracker')
        })
      })

      context('when !(duration || timeLeft || isTracking || isDone) prop', () => {
        it('should not render', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps()} />)

          expect(wrapper).to.have.exactly(0).descendants('.reset-tracker')
        })
      })

      context('when clicked', () => {
        it('should call handleResetTracker() prop with routineId', () => {
          const handleResetTracker = td.function()
          const passedId = '123'
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: passedId,
            routineName: 'The Routine',
            duration: moment('12:34:56', 'HH:mm:ss'),
            isTracking: true,
            handleResetTracker,
          })} />)
          const trackerLink = wrapper.find('.reset-tracker')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'reset-tracker',
            },
          }

          const expectedArg = passedId

          td.verify(handleResetTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleResetTracker(expectedArg), { times: 1 })
        })
      })
    })

    /* ============================================
    =            Toggle isDone Button            =
    ============================================ */

    describe('isDone button', () => {
      it('there should be one', () => {
        const wrapper = shallow(<RoutineItem {...getRequiredProps({
          id: '123',
          routineName: 'The Routine',
        })} />)

        expect(wrapper).to.have.exactly(1).descendants('.toggleIsDone')
      })

      context('when isDone is not set to true', () => {
        it('should contain one AndD Icon which has a type of \'check-circle-0\'', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
          })} />)
          const icon = wrapper.find('.toggleIsDone').find(Icon)

          expect(icon).to.have.lengthOf(1)
          expect(icon).to.have.prop('type', 'check-circle-o')
        })

        it('should call handleMarkDone() with routineId prop when pressed', () => {
          const handleMarkDone = td.function()
          const passedId = '123'
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: passedId,
            routineName: 'The Routine',
            handleMarkDone,
          })} />)
          const trackerLink = wrapper.find('.toggleIsDone')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'toggleIsDone',
            },
          }

          const expectedArg = passedId

          td.verify(handleMarkDone(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleMarkDone(expectedArg), { times: 1 })
        })

        it('should NOT call handleResetTracker() prop when pressed', () => {
          const handleResetTracker = td.function()
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            handleResetTracker,
          })} />)
          const trackerLink = wrapper.find('.toggleIsDone')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'toggleIsDone',
            },
          }

          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleResetTracker(), { times: 0, ignoreExtraArgs: 0 })
        })
      })

      context('when isDone is set to true', () => {
        it('should be \'check-circle-0\' icon if isDone is not set to true', () => {
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            isDone: true,
          })} />)
          const icon = wrapper.find('.toggleIsDone').find(Icon)

          expect(icon).to.have.lengthOf(1)
          expect(icon).to.have.prop('type', 'check-circle')
        })

        it('should call handleResetTracker() with routineId prop when pressed', () => {
          const handleResetTracker = td.function()
          const passedId = '123'
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: passedId,
            routineName: 'The Routine',
            isDone: true,
            handleResetTracker,
          })} />)
          const trackerLink = wrapper.find('.toggleIsDone')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'toggleIsDone',
            },
          }

          const expectedArg = passedId

          td.verify(handleResetTracker(), { times: 0, ignoreExtraArgs: 0 })
          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleResetTracker(expectedArg), { times: 1 })
        })

        it('should NOT call handleMarkDone() prop when pressed', () => {
          const handleMarkDone = td.function()
          const wrapper = shallow(<RoutineItem {...getRequiredProps({
            id: '123',
            routineName: 'The Routine',
            isDone: true,
            handleMarkDone,
          })} />)
          const trackerLink = wrapper.find('.toggleIsDone')
          const fakeEv = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: {
              className: 'toggleIsDone',
            },
          }

          trackerLink.prop('onClick')(fakeEv)
          td.verify(handleMarkDone(), { times: 0, ignoreExtraArgs: 0 })
        })
      })
    })
  })
})
