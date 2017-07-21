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

  it('can handle ADD_ROUTINE', () => {
    const testAddingOneRoutineToTwo = () => {
      const payload = {
        routineName: 'Do something new',
        duration: moment('03:33:33', 'HH:mm:ss'),
        reminder: moment('3:33 am', 'h:mm a'),
      }

      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
          reminder: moment('1:11 am', 'h:mm a'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
          reminder: moment('2:22 am', 'h:mm a'),
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

  it('can handle EDIT_ROUTINE', () => {
    const testEditingOneRoutineOutOfThree = () => {
      const payload = {
        id: '3',
        routineName: 'Do one last thing differently',
        duration: moment('04:44:44', 'HH:mm:ss'),
        reminder: moment('4:44 am', 'h:mm a'),
      }

      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
          reminder: moment('1:11 am', 'h:mm a'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
          reminder: moment('2:22 am', 'h:mm a'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
          reminder: moment('03:33 am', 'h:mm a'),
        },
      ]

      const action = {
        type: actionTypes.EDIT_ROUTINE,
        payload,
      }

      const expectedState = initialState.map(routineObj => (
        routineObj.id === payload.id ? payload : routineObj
      ))

      const actualState  = reducers.routines(initialState, action)

      expect(actualState).to.deep.equal(expectedState)
    }

    const testEditingOneRoutineOutOfZero = () => {
      const payload = {
        id: '3',
        routineName: 'Do nothing differently',
        duration: moment('04:44:44', 'HH:mm:ss'),
        reminder: moment('4:44 am', 'h:mm a'),
      }

      const initialState = []

      const action = {
        type: actionTypes.EDIT_ROUTINE,
        payload,
      }

      const expectedState = []

      const actualState  = reducers.routines(initialState, action)

      expect(actualState).to.deep.equal(expectedState)
    }

    testEditingOneRoutineOutOfThree()
    testEditingOneRoutineOutOfZero()
  })
})