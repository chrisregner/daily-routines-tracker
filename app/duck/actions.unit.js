import { expect } from 'chai'
import moment from 'moment'

import * as actions from './actions'
import * as actionTypes from './actionTypes'

describe('REDUX: action creators', () => {
  it('has action creator for adding a routine', () => {
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

  it('has action creator for editing a routine', () => {
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

  it('has action creator for deleting a routine', () => {
    const passedId = '123'
    const result = actions.deleteRoutine(passedId)

    expect(result).to.deep.equal({
      type: actionTypes.DELETE_ROUTINE,
      payload: {
        id: passedId,
      },
    })
  })

  it('has action creator for starting tracking a routine', () => {
    const passedId = '123'
    const result = actions.startTracker(passedId)

    expect(result).to.deep.equal({
      type: actionTypes.START_TRACKER,
      payload: {
        id: passedId,
      },
    })
  })
})
