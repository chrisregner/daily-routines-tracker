import { expect } from 'chai'
import moment from 'moment'

import * as actions from './actions'
import * as actionTypes from './actionTypes'

describe('RoutineForm actions', () => {
  it('can create an action to add a routine', () => {
    const formData = {
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }
    const result = actions.addRoutine(formData)

    expect(result).to.deep.equal({
      type: actionTypes.ADD_ROUTINE,
      payload: formData,
    })
  })

  it('can create an action to edit a routine', () => {
    const formData = {
      id: '123',
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }
    const result = actions.editRoutine(formData)

    expect(result).to.deep.equal({
      type: actionTypes.EDIT_ROUTINE,
      payload: formData,
    })
  })

  it('can create an action to delete a routine', () => {
    const passedId = '123'
    const result = actions.deleteRoutine(passedId)

    expect(result).to.deep.equal({
      type: actionTypes.DELETE_ROUTINE,
      payload: {
        id: passedId,
      },
    })
  })
})
