import { expect } from 'chai'
import td from 'testdouble'
import moment from 'moment'
import lolex from 'lolex'

describe('REDUX: action creators', () => {
  let actions

  beforeEach(() => {
    actions = require('./actions')
  })

  afterEach(() => {
    td.reset()

    // clear last interval (https://stackoverflow.com/a/6843291/7823311)
    const i = setInterval (function () {}, 10000);
    clearInterval (i - 1)
    clearInterval (i)
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
        it('should call clearInterval with an argument', () => {
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

          td.verify(clearInterval(td.matchers.anything()), { times: 1 })
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
        const clock = lolex.install()
        const dispatch = td.function()
        actions.startTracker()(dispatch)

        const expectedArg = actions.tickTracker()

        td.verify(dispatch(expectedArg), { times: 0 })
        clock.tick(50)
        td.verify(dispatch(expectedArg), { times: 0 })
        clock.tick(60)
        td.verify(dispatch(expectedArg), { times: 1 })
        clock.tick(300)
        td.verify(dispatch(expectedArg), { times: 4 })

        // teardown
        clock.uninstall()

        // TODO: findout if we need to somehow clear the interval created by actions.startTracker()()
     })

      it('should call clearInterval with an argument', () => {
        const clearInterval = td.replace(global, 'clearInterval')
        const dispatch = () => {}
        actions.startTracker()(dispatch)

        td.verify(clearInterval(td.matchers.anything()), { times: 1 })

        // TODO: findout if we need to somehow clear the interval created by actions.startTracker()()
      })
    })
  })

  describe('action creator for stopping tracker', () => {
    it('should call clearInterval with an argument', () => {
      const clearInterval = td.replace(global, 'clearInterval')
      const dispatch = () => {}
      actions.stopTracker()

      td.verify(clearInterval(td.matchers.anything()), { times: 1 })
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
        it('should call clearInterval with an argument', () => {
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

          td.verify(clearInterval(td.matchers.anything()), { times: 1 })
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

})
