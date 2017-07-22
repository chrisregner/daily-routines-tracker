
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import moment from 'moment'

import RoutineList from './RoutineList'
import RoutineItem from './subcomponents/RoutineItem'

describe('COMPONENT: RoutineList', () => {
  const getRequiredProps = props => Object.assign({
    handleStartTracker: () => {},
    handleEditRoutine: () => {},
    routines: [],
  }, props)

  it('should render with <ul /> as its root componenet', () => {
    const wrapper = shallow(<RoutineList {...getRequiredProps()} />)
    expect(wrapper.is('ul')).to.equal(true)
  })

  context('when routines prop is passed', () => {
    it('should render each routine', () => {
      const testRenderingThreeRoutines = () => {
        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: [
              {
                id: '1',
                routineName: 'First Routine',
              },
              {
                id: '2',
                routineName: 'Second Routine',
              },
              {
                id: '3',
                routineName: 'Third Routine',
              },
            ],
          })} />
        )

        expect(wrapper).to.have.exactly(3).descendants(RoutineItem)
      }

      const testRenderingOneRoutine = () => {
        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: [{
              id: '1',
              routineName: 'First Routine',
            }],
          })} />
        )

        expect(wrapper).to.have.exactly(1).descendants(RoutineItem)
      }

      testRenderingThreeRoutines()
      testRenderingOneRoutine()
    })

    describe('each rendered routine', () => {
      it('should receive the routine data as props', () => {
        const routineData = {
          id: '1',
          routineName: 'First Routine',
          duration: moment('12:34:56', 'HH:mm:ss'),
          reminder: moment('12:34 a', 'h:mm a'),
        }
        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: [routineData],
          })} />
        )

        expect(wrapper.find(RoutineItem)).to.have.props(routineData)
      })

       it('should receive the handleStartTracker() prop which is prop of <RoutineList /> itself', () => {
        const handleStartTracker = () => {}
        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: [{
              id: '1',
              routineName: 'First Routine',
              duration: moment('12:34:56', 'HH:mm:ss'),
              reminder: moment('12:34 a', 'h:mm a'),
            }],
            handleStartTracker
          })} />
        )

        expect(wrapper.find(RoutineItem)).to.have.props({ handleStartTracker })
      })

      /* it('should receive the handleEditRoutine() prop which is prop of <RoutineList /> itself', () => {
        const handleEditRoutine = () => {}
        const wrapper = shallow(
          <RoutineList {...getRequiredProps({
            routines: [{
              id: '1',
              routineName: 'First Routine',
              duration: moment('12:34:56', 'HH:mm:ss'),
              reminder: moment('12:34 a', 'h:mm a'),
            }],
            handleEditRoutine
          })} />
        )

        expect(wrapper.find(RoutineItem)).to.have.props({ handleEditRoutine })
      }) */
    })
  })

  context('when no routines prop is passed', () => {
    it('should inform user that there are no routine', () => {
      const wrapper = shallow(
        <RoutineList {...getRequiredProps({
          routines: [],
        })} />
      )

      expect(wrapper.text()).to.contain('no routine')
    })
  })
})
