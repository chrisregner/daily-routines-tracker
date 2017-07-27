import { expect } from 'chai'
import moment from 'moment'
import getDiff from 'deep-diff'

import { getLastIntervalId } from './actions'
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
    if (statePartDiff.path[1] === 'duration') {
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

describe('REDUCER: routines', () => {
  before(() => {
    moment()
  })

  afterEach(() => {
    clearInterval(getLastIntervalId())
  })

  /*===================================================================
  =            Actions for routines' basic CRUD operations            =
  ===================================================================*/

  it('should return the initial state', () => {
    const expectedStatePart = [{
      routineName: 'Jog',
      duration: moment('00:00:01', 'HH:mm:ss'),
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
      }

      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
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
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
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
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
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
    it('should be able to overwrite routeName, and duration with new values, even with null', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing differently',
          duration: moment('04:44:44', 'HH:mm:ss'),
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'EDIT_ROUTINE',
        payload: {
          id: '3',
          routineName: 'Do one last thing differently',
          duration: moment('04:44:44', 'HH:mm:ss'),
        },
      })

      expect(actualState).to.deep.match(expectedState)
    })

    it('should not delete existing properties if not explicitly set to falsey values (i.e. when payload doesn\'t specify anything about these properties)', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'This routine should keep the duration as is',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'EDIT_ROUTINE',
        payload: {
          id: '3',
          routineName: 'This routine should keep the duration as is',
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })

    it('should set timeLeft to null and set isTracking to false IF duration will change', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
          timeLeft: moment('11:11:11', 'HH:mm:ss'),
          isTracking: true,
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Changed Routine',
          duration: moment('04:44:44', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'EDIT_ROUTINE',
        payload: {
          id: '3',
          routineName: 'Changed Routine',
          duration: moment('04:44:44', 'HH:mm:ss'),
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
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
          isTracking: true,
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('12:30:30', 'HH:mm:ss'),
          isTracking: true,
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '3',
          routineName: 'Do one last thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
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

  describe('handling TICK_TRACKER', () => {
    context('when timeLeft is not set yet', () => {
      it('should set the value of timeLeft to be 100 ms less than duration', () => {
        const initialState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            isTracking: true,
          },
        ]

        const expectedState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            timeLeft: moment('12:30:00', 'HH:mm:ss').subtract(100, 'milliseconds'),
            isTracking: true,
          },
        ]

        const actualState = reducers.routines(initialState, {
          type: 'TICK_TRACKER'
        })

        expect(actualState).to.deep.equal(expectedState)
      })
    })

    context('when timeLeft is set', () => {
      it('should set the value of timeLeft to be 100 ms less than the previous timeLeft', () => {
        const initialState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            timeLeft: moment('12:29:00', 'HH:mm:ss'),
            isTracking: true,
          },
        ]

        const expectedState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            timeLeft: moment('12:29:00', 'HH:mm:ss').subtract(100, 'milliseconds'),
            isTracking: true,
          },
        ]

        const actualState = reducers.routines(initialState, {
          type: 'TICK_TRACKER'
        })

        expect(actualState).to.deep.equal(expectedState)
      })
    })

    context('when timeLeft is 00:00:00.100', () => {
      it('should set timeLeft to null, isTracking to false, and isDone to true', () => {
        const initialState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            timeLeft: moment('00:00:00', 'HH:mm:ss').add(100, 'milliseconds'),
            isTracking: true,
          },
        ]

        const expectedState = [
          {
            id: '1',
            routineName: 'Do something',
            duration: moment('11:11:11', 'HH:mm:ss'),
          },
          {
            id: '2',
            routineName: 'Do another thing',
            duration: moment('12:30:00', 'HH:mm:ss'),
            timeLeft: null,
            isTracking: false,
            isDone: true,
          },
        ]

        const actualState = reducers.routines(initialState, {
          type: 'TICK_TRACKER'
        })

        expect(actualState).to.deep.equal(expectedState)
      })
    })
  })

  it('can handle STOP_TRACKER', () => {
    const initialState = [
      {
        id: '1',
        routineName: 'Do something',
        duration: moment('11:11:11', 'HH:mm:ss'),
      },
      {
        id: '2',
        routineName: 'Do another thing',
        duration: moment('12:30:00', 'HH:mm:ss'),
        isTracking: true,
      },
    ]

    const expectedState = [
      {
        id: '1',
        routineName: 'Do something',
        duration: moment('11:11:11', 'HH:mm:ss'),
      },
      {
        id: '2',
        routineName: 'Do another thing',
        duration: moment('12:30:00', 'HH:mm:ss'),
        isTracking: false,
      },
    ]

    const actualState = reducers.routines(initialState, {
      type: 'STOP_TRACKER'
    })

    expect(actualState).to.deep.equal(expectedState)
  })

  describe('handling RESET_TRACKER', () => {
    it('should set timeLeft to null, isTracking to false, and isDone to false', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: moment('01:15:15', 'HH:mm:ss'),
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
          isDone: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'RESET_TRACKER',
        payload: {
          id: '2'
        }
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })

  describe('handling MARK_DONE', () => {
    it('should set timeLeft to null, isTracking to false, and isDone to true', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: moment('01:15:15', 'HH:mm:ss'),
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
          isDone: true,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'MARK_DONE',
        payload: {
          id: '2'
        }
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })

  /*=================================================
  =            Misc Actions for Routines            =
  =================================================*/

  describe('handling RESET_ALL_TRACKERS', () => {
    it('should set all routine\'s timeLeft to null, isTracking to false, and isDone to false', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
          isDone: true,
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: moment('01:15:15', 'HH:mm:ss'),
          isTracking: true,
        },
      ]

      const expectedState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('11:11:11', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
          isDone: false,
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
          isDone: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'RESET_ALL_ROUTINES',
        payload: {
          id: '2'
        }
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })
})
