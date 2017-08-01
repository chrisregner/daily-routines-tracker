import { expect } from 'chai'
import td from 'testdouble'
import moment from 'moment'
import lolex from 'lolex'

describe('ACTION: creators', () => {
  let actions, fakeClock
  const teardown = () => {
    td.reset()
    clearInterval(actions.getLastIntervalId())

    if (fakeClock && fakeClock.uninstall) {
      fakeClock.uninstall()
      fakeClock = null
    }

    // TODO: determine if the next line helps with slow testing issue
    clearInterval(actions.getLastIntervalId())
  }

  beforeEach(() => {
    actions = require('./actions')
  })


  afterEach(() => {
    teardown()
  })

  /*===================================================================
  =            Actions for routines' basic CRUD operations            =
  ===================================================================*/

  it('has action creator for adding a routine', () => {
    const formData = {
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }

    const actual = actions.addRoutine(formData)
    const expected = {
      type: 'ADD_ROUTINE',
      payload: formData,
    }

    expect(actual).to.deep.equal(expected)
  })

  describe('action creator for editing a routine', () => {
    it('should be a function that returns another function', () => {
      const res = actions.editRoutine()
      expect(res).to.be.a('function')
    })

    describe('function returned by the action creator for editing a routine', () => {
      context('when target routine is tracking and duration will change', () => {
        it('should call clearInterval with the last interval ID', () => {
          const clearInterval = td.replace(global, 'clearInterval')
          const dispatch = () => {}
          const idOfTrackingRoutine = '2'
          const fakeDispatch = () => {}
          const fakeGetState = () => ({
            routines: [
              { id: '1', isTracking: false },
              {
                id: idOfTrackingRoutine,
                duration: moment('11:11:11', 'HH:mm:ss'),
                isTracking: true,
              },
              { id: '3' },
            ]
          })
          const formData = {
            id: idOfTrackingRoutine,
            routineName: 'Routine Name',
            duration: moment('01:01:01', 'HH:mm:ss'),
            reminder: moment('12:30:30', 'H:mm a'),
          }

          actions.editRoutine(formData)(fakeDispatch, fakeGetState)

          td.verify(clearInterval(actions.getLastIntervalId()), { times: 1 })
        })
      })

      context('when target routine is tracking but duration will not change', () => {
        it('should NOT call clearInterval', () => {
          const clearInterval = td.replace(global, 'clearInterval')
          const dispatch = () => {}
          const idOfTrackingRoutine = '2'
          const fakeDispatch = () => {}
          const fakeGetState = () => ({
            routines: [
              { id: '1', isTracking: true },
              {
                id: idOfTrackingRoutine,
                duration: moment('11:11:11', 'HH:mm:ss'),
                isTracking: true,
              },
              { id: '3' },
            ]
          })
          const formData = {
            id: idOfTrackingRoutine,
            routineName: 'Routine Name',
            duration: moment('11:11:11', 'HH:mm:ss'),
            reminder: moment('12:30:30', 'H:mm a'),
          }

          actions.editRoutine(formData)(fakeDispatch, fakeGetState)

          td.verify(clearInterval(), { times: 0, ignoreExtraArgs: true })
        })
      })

      context('when target routine is not tracking', () => {
        it('should NOT call clearInterval', () => {
          const clearInterval = td.replace(global, 'clearInterval')
          const dispatch = () => {}
          const idOfNonTrackingRoutine = '2'
          const fakeDispatch = () => {}
          const fakeGetState = () => ({
            routines: [
              { id: '1', isTracking: true },
              { id: idOfNonTrackingRoutine, isTracking: false },
              { id: '3' },
            ]
          })
          const formData = {
            id: idOfNonTrackingRoutine,
            routineName: 'Routine Name',
            duration: moment('12:30:30', 'HH:mm:ss'),
            reminder: moment('12:30:30', 'H:mm a'),
          }

          actions.editRoutine(formData)(fakeDispatch, fakeGetState)

          td.verify(clearInterval(), { times: 0, ignoreExtraArgs: true })
        })
      })

      it('should call dispatch with an action for editing a routine', () => {
        const formData = {
          id: '123',
          routineName: 'Routine Name',
          duration: moment('12:30:30', 'HH:mm:ss'),
          reminder: moment('12:30:30', 'H:mm a'),
        }
        const fakeDispatch = td.function()
        const fakeGetState = () => ({
          routines: [{ id: '123' }]
        })

        actions.editRoutine(formData)(fakeDispatch, fakeGetState)

        const expectedArg = {
          type: 'EDIT_ROUTINE',
          payload: formData,
        }

        td.verify(fakeDispatch(expectedArg), { times: 1 })
      })
    })
  })

  it('has action creator for deleting a routine', () => {
    const passedId = '123'

    const actual = actions.deleteRoutine(passedId)
    const expected = {
      type: 'DELETE_ROUTINE',
      payload: {
        id: passedId,
      },
    }

    expect(actual).to.deep.equal(expected)
  })

  /*============================================================
  =            Actions for routine tracking feature            =
  ============================================================*/

  it('has action creator for ticking tracker', () => {
    const actual = actions.tickTracker()
    const expected = {
      type: 'TICK_TRACKER',
    }

    expect(actual).to.deep.equal(expected)
  })

  describe('action creator for starting tracker', () => {
    it('should be a function that returns another function', () => {
      const res = actions.startTracker()
      expect(res).to.be.a('function')
    })

    describe('the returned function of the action for starting tracker',  () => {
      it('should call dispatch (from second set of argument) with the correct action derived from its first set of argument', () => {
        const passedId = '123'
        const dispatch = td.function()

        actions.startTracker(passedId)(dispatch)

        const expectedArg = {
          type: 'START_TRACKER',
          payload: {
            id: passedId,
          },
        }

        td.verify(dispatch(expectedArg), { times: 1 })
      })

      it('should call dispatch (from second set of argument) the result of tickTracker right when its called, and then every 100ms after that', () => {
        fakeClock = lolex.install()
        const fakeGetState = () => ({ routines: [{ id: '123' }] })
        const fakeDispatch = td.function()
        actions.startTracker('123')(fakeDispatch, fakeGetState)

        const expectedArg = actions.tickTracker()

        td.verify(fakeDispatch(expectedArg), { times: 0 })
        fakeClock.tick(50)
        td.verify(fakeDispatch(expectedArg), { times: 0 })
        fakeClock.tick(60)
        td.verify(fakeDispatch(expectedArg), { times: 1 })
        fakeClock.tick(300)
        td.verify(fakeDispatch(expectedArg), { times: 4 })
      })

      context('when 100ms is past after the target routine\'s timeLeft value was equal or less than 00:00:00.100', () => {
        it('should call clearInterval again with the last interval ID', () => {
          const testWhereTimeLeftWasEqual100ms = () => {
            fakeClock = lolex.install()
            const clearInterval = td.replace(global, 'clearInterval')
            const fakeDispatch = () => {}
            const fakeGetState = () => ({
              routines: [{
                id: '123',
                timeLeft: moment('00:00:00.100', 'HH:mm:ss.SSS'),
              }]
            })

            actions.startTracker('123')(fakeDispatch, fakeGetState)
            fakeClock.tick(90)
            td.verify(clearInterval(actions.getLastIntervalId()), { times: 0 })
            fakeClock.tick(20)
            td.verify(clearInterval(actions.getLastIntervalId()), { times: 1 })

            teardown()
          }

          const testWhereTimeLeftWasLessThan100ms = () => {
            fakeClock = lolex.install()
            const clearInterval = td.replace(global, 'clearInterval')
            const fakeDispatch = () => {}
            const fakeGetState = () => ({
              routines: [{
                id: '123',
                timeLeft: moment('00:00:00.010', 'HH:mm:ss.SSS'),
              }]
            })

            actions.startTracker('123')(fakeDispatch, fakeGetState)
            fakeClock.tick(90)
            td.verify(clearInterval(actions.getLastIntervalId()), { times: 0 })
            fakeClock.tick(20)
            td.verify(clearInterval(actions.getLastIntervalId()), { times: 1 })

            teardown()
          }

          testWhereTimeLeftWasEqual100ms()
          testWhereTimeLeftWasLessThan100ms()
        })

        it('should dispatch tickTracker once again but no more after that', () => {
          const testWhereTimeLeftWasEqual100ms = () => {
            fakeClock = lolex.install()
            const fakeDispatch = td.function()
            const fakeGetState = () => ({
              routines: [{
                id: '123',
                timeLeft: moment('00:00:00.100', 'HH:mm:ss.SSS'),
              }]
            })

            actions.startTracker('123')(fakeDispatch, fakeGetState)
            fakeClock.tick(90)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 0 })
            fakeClock.tick(20)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 1 })
            fakeClock.tick(1000)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 1 })

            teardown()
          }

          const testWhereTimeLeftWasLessThan100ms = () => {
            fakeClock = lolex.install()
            const fakeDispatch = td.function()
            const fakeGetState = () => ({
              routines: [{
                id: '123',
                timeLeft: moment('00:00:00.100', 'HH:mm:ss.SSS'),
              }]
            })

            actions.startTracker('123')(fakeDispatch, fakeGetState)
            fakeClock.tick(90)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 0 })
            fakeClock.tick(20)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 1 })
            fakeClock.tick(1000)
            td.verify(fakeDispatch(actions.tickTracker()), { times: 1 })

            teardown()
          }

          testWhereTimeLeftWasEqual100ms()
          testWhereTimeLeftWasLessThan100ms()
        })
      })

      it('should call clearInterval with the previous interval ID', () => {
        const clearInterval = td.replace(global, 'clearInterval')
        const dispatch = () => {}
        actions.startTracker()(dispatch)

        /**
         * We have no means of getting the previous interval ID (we've only exposed the latest one)
         * so we'll use td.matchers.anything() instead
         */
        td.verify(clearInterval(td.matchers.anything()), { times: 1 })
      })
    })
  })

  describe('action creator for stopping tracker', () => {
    it('should call clearInterval with the last interval ID', () => {
      const clearInterval = td.replace(global, 'clearInterval')
      const dispatch = () => {}
      actions.stopTracker()

      td.verify(clearInterval(actions.getLastIntervalId()), { times: 1 })
    })

    it('should return an action for stopping tracker', () => {
      const passedId = '123'

      const actual = actions.stopTracker(passedId)
      const expected = {
        type: 'STOP_TRACKER',
      }

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('action creator for resetting tracker', () => {
    it('should be a function that returns function', () => {
      const res = actions.resetTracker()
      expect(res).to.be.a('function')
    })

    describe('the function returned by action for resetting tracker', () => {
      context('when target routine is tracking', () => {
        it('should call clearInterval with the last interval ID', () => {
          const clearInterval = td.replace(global, 'clearInterval')
          const dispatch = () => {}
          const idOfTrackingRoutine = '2'
          const fakeDispatch = () => {}
          const fakeGetState = () => ({
            routines: [
              { id: '1', isTracking: false },
              { id: idOfTrackingRoutine, isTracking: true },
              { id: '3' },
            ]
          })

          actions.resetTracker(idOfTrackingRoutine)(fakeDispatch, fakeGetState)

          td.verify(clearInterval(actions.getLastIntervalId()), { times: 1 })
        })
      })

      context('when target routine is not tracking', () => {
        it('should NOT call clearInterval', () => {
          const clearInterval = td.replace(global, 'clearInterval')
          const dispatch = () => {}
          const idOfNonTrackingRoutine = '2'
          const fakeDispatch = () => {}
          const fakeGetState = () => ({
            routines: [
              { id: '1', isTracking: true },
              { id: idOfNonTrackingRoutine, isTracking: false },
              { id: '3' },
            ]
          })

          actions.resetTracker(idOfNonTrackingRoutine)(fakeDispatch, fakeGetState)

          td.verify(clearInterval(), { times: 0, ignoreExtraArgs: true })
        })
      })

      it('should call dispatch with an action for resetting a tracker', () => {
        const passedId = '123'
        const fakeGetState = () => ({
          routines: [{ id: '123' }]
        })
        const fakeDispatch = td.function()

        actions.resetTracker(passedId)(fakeDispatch, fakeGetState)

        const expectedArg = {
          type: 'RESET_TRACKER',
          payload: {
            id: passedId,
          },
        }

        td.verify(fakeDispatch(expectedArg), { times: 1 })
      })
    })
  })

  it('has action creator for marking routine done', () => {
    const actual = actions.markDone('123')
    const expected = {
      type: 'MARK_DONE',
      payload: {
        id: '123',
      }
    }

    expect(actual).to.deep.equal(expected)
  })


  /*=================================================
  =            Misc Actions for Routines            =
  =================================================*/

  it('has action creator for resetting all routines', () => {
    const actual = actions.resetAllRoutines()
    const expected = {
      type: 'RESET_ALL_ROUTINES',
    }

    expect(actual).to.deep.equal(expected)
  })

  it('has action for setting routines', () => {
    const passedRoutines = 'passedRoutines'

    const actual = actions.setRoutines(passedRoutines)
    const expected = {
      type: 'SET_ROUTINES',
      payload: {
        routines: passedRoutines
      }
    }

    expect(actual).to.deep.equal(expected)
  })

  it('has action for clearing notification', () => {
    const passedRoutines = 'passedRoutines'

    const actual = actions.clearNotifs(passedRoutines)
    const expected = {
      type: 'CLEAR_NOTIFS'
    }

    expect(actual).to.deep.equal(expected)
  })

  /*===================================================
  =            Misc Actions for Root State            =
  ===================================================*/

  it('has action for toggling sort', () => {
    const actual = actions.toggleSort()
    const expected = {
      type: 'TOGGLE_SORT'
    }

    expect(actual).to.deep.equal(expected)
  })
})

