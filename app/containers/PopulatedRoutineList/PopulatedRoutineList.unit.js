import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import RoutineList from 'components/RoutineList'
import PopulatedRoutineList from './PopulatedRoutineList'

describe('CONTAINER: PopulatedRoutineList', () => {
  const getMockStore = configureMockStore()
  const createInstance = (passedProps) => {
    const initialState = { routines: [] }
    const requiredProps = {
      store: getMockStore(initialState),
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(
      <MemoryRouter>
        <PopulatedRoutineList {...finalProps} />
      </MemoryRouter>
    )
      .find(PopulatedRoutineList)
  }

  afterEach(() => { td.reset() })

  it('should render <RoutineList /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(RoutineList)
  })

  describe('the rendered <RoutineList />', () => {
    it('should receive the routines from state as props', () => {
      const testSpecWithRoutines = (routines) => {
        const initialState = {
          routines
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('routines', routines)
      }

      testSpecWithRoutines([])
      testSpecWithRoutines([
        { id: '123' },
        { id: '456' },
        { id: '143' },
      ])
    })
  })
})
