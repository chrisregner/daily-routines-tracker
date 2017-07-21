import React from 'react'
import chai, { expect } from 'chai'
import { shallow } from 'enzyme'

import EditRoutineForm from './EditRoutineForm'
import RoutineForm from 'components/RoutineForm'

describe('<EditRoutineForm />', () => {
  it('should render <RoutineForm /> inside the HOC')

  describe('the rendered <RoutineForm />', () => {
    context('when route id matches a routine', () => {
      it('should receive the correct initialValues prop according to the route data')

      it('should receive a handleSubmit() prop')

      describe('the passed handleSubmit() prop', () => {
        it('should dispatch EDIT_ROUTINE with its arguments')
        it('should redirect to path \'/\' after calling the dispatch')
      })

      it('should receive a handleDelete() prop')

      describe('the passed handleDelete() prop', () => {
        it('should dispatch DELETE_ROUTINE with its arguments')
        it('should redirect to path \'/\' after calling the dispatch')
      })
    })

    context('when route id does not match any routine', () => {
      it('should receive true as notFound prop')
    })
  })
})
