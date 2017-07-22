import { expect } from 'chai'
import moment from 'moment'
import getDiff from 'deep-diff'

import * as reducers from './reducers'
import * as actionTypes from './actionTypes'

const diffThatIsIdOnly = (expected, actual) => {
  let hasNonIdDiff
  let noOfDiff = 0
  const diff = getDiff(expected, actual)

  diff.find((statePartDiff) => {
    if (statePartDiff.path[1] === 'id') {
      noOfDiff++

      return
    }

    const { lhs, rhs } = statePartDiff

    /**
     * For some reason, the first time the test scripts are run after
     * entering the command in console, pairs of Moment objects (one from
     * expected param, another from actual param) are different by date. This
     * issue doesn't persist through re-runs (when test scripts are watched and
     * a file is changed).
     *
     * To resolve that issue, we'll specifically re-compare the duration Moment
     * objects as a whole whenever they differ, and then treat them as equal if
     * the case is just the one described above.
     */
    if (
      statePartDiff.path[1] === 'duration'
      || statePartDiff.path[1] === 'reminder'
    ) {
      const path = statePartDiff.path
      const momentOne = expected[path[0]][path[1]]
      const momentTwo = actual[path[0]][path[1]]
      const momentOneFormatted = momentOne.format(momentOne.creationData().format)
      const momentTwoFormatted = momentTwo.format(momentTwo.creationData().format)

      if (momentOneFormatted === momentTwoFormatted)
        return
    }

    hasNonIdDiff = true

    return true
  })

  return hasNonIdDiff ? false : noOfDiff
}

describe('REDUX: reducer#routines', () => {
  before(() => {
    moment()
  })

  /*===================================================================
  =            Actions for routines' basic CRUD operations            =
  ===================================================================*/

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
    const expectedNoOfDiff = 2

    expect(noOfDiffThatIsOnlyId).to.equal(expectedNoOfDiff)
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
        type: 'ADD_ROUTINE',
        payload,
      }

      const expectedState = [
        payload,
        ...initialState,
      ]

      const actualState = reducers.routines(initialState, action)
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
        type: 'ADD_ROUTINE',
        payload,
      }

      const expectedState = [payload]

      const actualState = reducers.routines(initialState, action)
      const noOfDiffThatIsOnlyId = diffThatIsIdOnly(expectedState, actualState)
      const expectedNoOfIdAdded = 1

      expect(noOfDiffThatIsOnlyId).to.equal(expectedNoOfIdAdded)
    }

    testAddingOneRoutineToTwo()
    testAddingOneRoutineToZero()
  })

  it('can handle DELETE_ROUTINE', () => {
    const testDeletingOneRoutineOutOfThree = () => {
      const payload = { id: '2' }

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
        type: 'DELETE_ROUTINE',
        payload,
      }

      const expectedState = initialState.filter(routineObj => routineObj.id !== payload.id)

      const actualState = reducers.routines(initialState, action)

      expect(actualState).to.deep.equal(expectedState)
    }

    const testDeletingOneRoutineOutOfOne = () => {
      const payload = { id: '1' }

      const initialState = [{
        id: '1',
        routineName: 'Do something',
        duration: moment('11:11:11', 'HH:mm:ss'),
        reminder: moment('1:11 am', 'h:mm a'),
      }]

      const action = {
        type: 'DELETE_ROUTINE',
        payload,
      }

      const expectedState = []

      const actualState = reducers.routines(initialState, action)

      expect(actualState).to.deep.equal(expectedState)
    }

    const testDeletingARoutineMatchingNoneOutOfThree = () => {
      const payload = { id: '4' }

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
        type: 'DELETE_ROUTINE',
        payload,
      }

      const expectedState = initialState

      const actualState = reducers.routines(initialState, action)

      expect(actualState).to.deep.equal(expectedState)
    }

    testDeletingOneRoutineOutOfThree()
    testDeletingOneRoutineOutOfOne()
    testDeletingARoutineMatchingNoneOutOfThree()
  })

  describe('handling EDIT_ROUTINE', () => {
    it('should be able to overwrite routeName, duration, and reminder with new values, even with null', () => {
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

      const expectedState = [
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
          routineName: 'Do one last thing differently',
          duration: moment('04:44:44', 'HH:mm:ss'),
          reminder: null,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'EDIT_ROUTINE',
        payload: {
          id: '3',
          routineName: 'Do one last thing differently',
          duration: moment('04:44:44', 'HH:mm:ss'),
          reminder: null,
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })

    it('should not delete existing properties if not explicitly set to falsey values (i.e. when payload doesn\'t specify anything about these properties)', () => {
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

      const expectedState = [
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
          routineName: 'This routine should keep the duration and reminder as is',
          duration: moment('03:33:33', 'HH:mm:ss'),
          reminder: moment('03:33 am', 'h:mm a'),
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'EDIT_ROUTINE',
        payload: {
          id: '3',
          routineName: 'This routine should keep the duration and reminder as is',
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })


  /*============================================================
  =            Actions for routine tracking feature            =
  ============================================================*/

  describe('handling START_TRACKER', () => {
    it('should set the target routine\'s isTracking property to true, and all others\' to false', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('12:30:30', 'HH:mm:ss'),
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
          isTracking: true,
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('12:30:30', 'HH:mm:ss'),
          reminder: moment('1:11 am', 'h:mm a'),
          isTracking: true,
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
          isTracking: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'START_TRACKER',
        payload: {
          id: '1',
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })

  it('can handle TICK_TRACKER', () => {
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
        duration: moment('12:30:00', 'HH:mm:ss'),
        reminder: moment('2:22 am', 'h:mm a'),
        isTracking: true,
      },
    ]

    const expectedState = [
      {
        id: '1',
        routineName: 'Do something',
        duration: moment('11:11:11', 'HH:mm:ss'),
        reminder: moment('1:11 am', 'h:mm a'),
      },
      {
        id: '2',
        routineName: 'Do another thing',
        duration: moment('12:30:00', 'HH:mm:ss').subtract(100, 'milliseconds'),
        reminder: moment('2:22 am', 'h:mm a'),
        isTracking: true,
      },
    ]

    const actualState = reducers.routines(initialState, {
      type: 'TICK_TRACKER'
    })

    expect(actualState).to.deep.equal(expectedState)
  })

  it('can handle STOP_TRACKER', () => {
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
        duration: moment('12:30:00', 'HH:mm:ss'),
        reminder: moment('2:22 am', 'h:mm a'),
        isTracking: true,
      },
    ]

    const expectedState = [
      {
        id: '1',
        routineName: 'Do something',
        duration: moment('11:11:11', 'HH:mm:ss'),
        reminder: moment('1:11 am', 'h:mm a'),
      },
      {
        id: '2',
        routineName: 'Do another thing',
        duration: moment('12:30:00', 'HH:mm:ss'),
        reminder: moment('2:22 am', 'h:mm a'),
        isTracking: false,
      },
    ]

    const actualState = reducers.routines(initialState, {
      type: 'STOP_TRACKER'
    })

    expect(actualState).to.deep.equal(expectedState)
  })
})
