import { expect } from 'chai'
import moment from 'moment'
import getDiff from 'deep-diff'

import * as reducers from './reducers'
import * as actionTypes from './actionTypes'

const diffThatIsIdOnly = (expected, actual) => {
  let hasNonIdDiff, noOfDiff = 0
  const diff = getDiff(expected, actual)

  diff.find((stateItem) => {
    if (stateItem.path[1] === 'id') {
      noOfDiff++

      return
    }

    hasNonIdDiff = true

    return true
  })

  if (hasNonIdDiff) return false

  return noOfDiff
}

describe('routines', () => {
  it('should return the initial state', () => {
    const expectedStatePart = [{
      routineName: 'Jog',
      duration: moment('00:15:00', 'HH:mm:ss'),
      reminder: moment('4:00 am', 'h:mm a'),
    }, {
    routineName: 'pneumonoultramicroscopicsilicovolcanoconiosis',
    duration: moment('08:00:00', 'HH:mm:ss'),
  }]

    const actualState = reducers.routines(undefined, {})
    const noOfDiffThatIsOnlyId = diffThatIsIdOnly(expectedStatePart, actualState)
    const expectedNoOfIdAdded = 2

    expect(noOfDiffThatIsOnlyId).to.equal(expectedNoOfIdAdded)
  })

  it('can handle ADD_Routine', () => {
    const testAddingOneRoutineToTwo = () => {
      const payload = {
        routineName: 'Do something new',
        duration: moment('03:33:33', 'HH:mm:ss'),
        reminder: moment('3:33 am', 'h:mm a'),
      }

      const initialState = [
        {
          id: 1,
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
          reminder: moment('1:11 am', 'h:mm a'),
        },
        {
          id: 2,
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
          reminder: moment('22:22 am', 'h:mm a'),
        },
      ]

      const action = {
        type: actionTypes.ADD_ROUTINE,
        payload,
      }

      const expectedState = [
        payload,
        ...initialState
      ]

      const actualState  = reducers.routines(initialState, action)
      const noOfDiffThatIsOnlyId = diffThatIsIdOnly(expectedState, actualState)
      const expectedNoOfIdAdded = 1

      expect(noOfDiffThatIsOnlyId).to.equal(expectedNoOfIdAdded)
    }

    const testAddingOneRoutineToZero = () => {
      const payload = {
        routineName: 'This will be the only thing to do.',
        duration: moment('03:33:33', 'HH:mm:ss'),
        reminder: moment('3:33 am', 'h:mm a'),
      }

      const initialState = []

      const action = {
        type: actionTypes.ADD_ROUTINE,
        payload,
      }

      const expectedState = [payload]

      const actualState  = reducers.routines(initialState, action)
      const noOfDiffThatIsOnlyId = diffThatIsIdOnly(expectedState, actualState)
      const expectedNoOfIdAdded = 1

      expect(noOfDiffThatIsOnlyId).to.equal(expectedNoOfIdAdded)
    }

    testAddingOneRoutineToTwo()
    testAddingOneRoutineToZero()
  })
})