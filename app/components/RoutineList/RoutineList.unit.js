import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import moment from 'moment'
import pick from 'lodash/pick'
import without from 'lodash/without'

import RoutineList from './RoutineList'
import RoutineItem from './subcomponents/RoutineItem'

chai.use(chaiEnzyme())

describe('<RoutineList />', () => {
  const getRequiredProps = props => props

  it('should render with <ul /> as its root componenet', () => {
    const wrapper = shallow(<RoutineList {...getRequiredProps()} />)
    expect(wrapper).to.have.tagName('ul')
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
            }]
          })} />
        )

        expect(wrapper).to.have.exactly(1).descendants(RoutineItem)
      }

      testRenderingThreeRoutines()
      testRenderingOneRoutine()
    })

    describe('each rendered routine', () => {
      it('should receive the routine data as props, except the id which is renamed to key', () => {
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
    })
  })

  context('when no routines prop is passed', () => {
    it('should inform user that there are no routine', () => {
      const wrapper = shallow(
        <RoutineList {...getRequiredProps({
          routines: []
        })} />
      )

      expect(wrapper.text()).to.contain('no routine')
    })
  })
})