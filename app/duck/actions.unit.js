import { expect } from 'chai'
import moment from 'moment'

import * as actions from './actions'
import * as actionTypes from './actionTypes'

describe('RoutineForm actions', () => {
  it('can create an action to add a routine', () => {
    const payload = {
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }
    const result = actions.addRoutine(payload)

    expect(result).to.deep.equal({
      type: actionTypes.ADD_ROUTINE,
      payload
    })
  })

  it('can create an action to edit a routine', () => {
    const payload = {
      id: '123',
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }
    const result = actions.editRoutine(payload)

    expect(result).to.deep.equal({
      type: actionTypes.EDIT_ROUTINE,
      payload
    })
  })
})