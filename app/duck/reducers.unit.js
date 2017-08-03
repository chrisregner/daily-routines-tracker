import { expect } from 'chai'
import moment from 'moment'

import * as reducers from './reducers'

describe('REDUCER: routines', () => {
  /* ===================================================================
  =            Actions for routines' basic CRUD operations            =
  =================================================================== */

  it('should return the initial state', () => {
    const expected = [{
      id: '1',
      routineName: 'Press that --->',
      duration: moment('00:00:03', 'HH:mm:ss'),
    }, {
      id: '2',
      routineName: 'Code',
      duration: moment('08:00:00', 'HH:mm:ss'),
    }, {
      id: '3',
      routineName: 'Read',
    }]

    const actual = reducers.routines(undefined, {})

    expect(actual).to.deep.equal(expected)
  })

  it('can handle ADD_ROUTINE', () => {
    const testAddingOneRoutineToTwo = () => {
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

      const expected = [
        {
          routineName: 'Do something new',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
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

      const actual = reducers.routines(initialState, {
        type: 'ADD_ROUTINE',
        payload: {
          routineName: 'Do something new',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      })

      expect(actual).to.deep.match(expected)
    }

    const testAddingOneRoutineToZero = () => {
      const initialState = []

      const expected = [
        {
          routineName: 'Do something new',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      ]

      const actual = reducers.routines(initialState, {
        type: 'ADD_ROUTINE',
        payload: {
          routineName: 'Do something new',
          duration: moment('03:33:33', 'HH:mm:ss'),
        },
      })

      expect(actual).to.deep.match(expected)
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

  /* ============================================================
  =            Actions for routine tracking feature            =
  ============================================================ */

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

      expect(actualState).to.deep.match(expectedState)
    })

    it('should copy the duration as timeLeft if there is no timeLeft yet', () => {
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
          timeLeft: moment('12:30:30', 'HH:mm:ss'),
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

      expect(actualState).to.deep.match(expectedState)
    })

    it('should left the timeLeft as is if there is one already', () => {
      const initialState = [
        {
          id: '1',
          routineName: 'Do something',
          duration: moment('12:30:30', 'HH:mm:ss'),
          timeLeft: moment('11:11:11', 'HH:mm:ss'),
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
          timeLeft: moment('11:11:11', 'HH:mm:ss'),
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

      expect(actualState).to.deep.match(expectedState)
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
          type: 'TICK_TRACKER',
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
          type: 'TICK_TRACKER',
        })

        expect(actualState).to.deep.equal(expectedState)
      })
    })

    context('when timeLeft is equal to or less than 00:00:00.100', () => {
      it('should set timeLeft to null, isTracking to false, isDone to true and shouldNotify to true', () => {
        const testWhereEqualTo100ms = () => {
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
              shouldNotify: true,
            },
          ]

          const actualState = reducers.routines(initialState, {
            type: 'TICK_TRACKER',
          })

          expect(actualState).to.deep.equal(expectedState)
        }

        const testWhereLessThan100ms = () => {
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
              timeLeft: moment('00:00:00', 'HH:mm:ss').add(10, 'milliseconds'),
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
              shouldNotify: true,
            },
          ]

          const actualState = reducers.routines(initialState, {
            type: 'TICK_TRACKER',
          })

          expect(actualState).to.deep.equal(expectedState)
        }

        testWhereEqualTo100ms()
        testWhereLessThan100ms()
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
      type: 'STOP_TRACKER',
    })

    expect(actualState).to.deep.equal(expectedState)
  })

  describe('handling RESET_TRACKER', () => {
    it('should set timeLeft to null, isTracking to false, isDone to false, and shouldNotify to false', () => {
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
          shouldNotify: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'RESET_TRACKER',
        payload: {
          id: '2',
        },
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
          id: '2',
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })

  /* =================================================
  =            Misc Actions for Routines            =
  ================================================= */

  describe('handling RESET_ALL_ROUTINES', () => {
    it('should set all routine\'s timeLeft to null, isTracking to false, isDone to false, and shouldNotify to false', () => {
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
          shouldNotify: false,
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('12:30:00', 'HH:mm:ss'),
          timeLeft: null,
          isTracking: false,
          isDone: false,
          shouldNotify: false,
        },
      ]

      const actualState = reducers.routines(initialState, {
        type: 'RESET_ALL_ROUTINES',
        payload: {
          id: '2',
        },
      })

      expect(actualState).to.deep.equal(expectedState)
    })
  })

  it('can handle SET_ROUTINES', () => {
    const passedRoutines = [
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

    const expectedState = passedRoutines
    const actualState = reducers.routines([], {
      type: 'SET_ROUTINES',
      payload: {
        routines: passedRoutines,
      },
    })

    expect(actualState).to.deep.equal(expectedState)
  })

  it('can handle CLEAR_NOTIFS', () => {
    const expectedState = [
      {
        id: '1',
        routineName: 'Do another thing',
        duration: moment('22:22:22', 'HH:mm:ss'),
        shouldNotify: false,
      },
      {
        id: '2',
        routineName: 'Do another thing',
        duration: moment('03:33:33', 'HH:mm:ss'),
        timeLeft: moment('11:11:11', 'HH:mm:ss'),
        isTracking: true,
        shouldNotify: false,
      },
    ]
    const actualState = reducers.routines(
      [
        {
          id: '1',
          routineName: 'Do another thing',
          duration: moment('22:22:22', 'HH:mm:ss'),
        },
        {
          id: '2',
          routineName: 'Do another thing',
          duration: moment('03:33:33', 'HH:mm:ss'),
          timeLeft: moment('11:11:11', 'HH:mm:ss'),
          isTracking: true,
          shouldNotify: true,
        },
      ],
      {
        type: 'CLEAR_NOTIFS',
      }
    )

    expect(actualState).to.deep.equal(expectedState)
  })

  /* ===================================================
  =            Misc Actions for Root State            =
  =================================================== */

  it('can handle TOGGLE_SORT', () => {
    const actual1 = reducers.isSorting(true, { type: 'TOGGLE_SORT' })
    expect(actual1).to.deep.equal(false)

    const actual2 = reducers.isSorting(false, { type: 'TOGGLE_SORT' })
    expect(actual2).to.deep.equal(true)
  })
})
