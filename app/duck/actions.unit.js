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

  it('has action creator for editing a routine', () => {
    const formData = {
      id: '123',
      routineName: 'Routine Name',
      duration: moment('12:30:30', 'HH:mm:ss'),
      reminder: moment('12:30:30', 'H:mm a'),
    }

    const actual = actions.editRoutine(formData)
    const expected = {
      type: 'EDIT_ROUTINE',
      payload: formData,
    }

    expect(actual).to.deep.equal(expected)
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

  it('has action for starting tracker', () => {
    const subj = actions.startTracker

    expect(subj).to.be.a('function')
  })

  describe('action for starting tracker', () => {
    it('should return a function', () => {
      const subj = actions.startTracker()

      expect(subj).to.be.a('function')
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

      it('should call clearInterval with an object', () => {
        const clearInterval = td.replace(global, 'clearInterval')
        const dispatch = () => {}
        actions.startTracker()(dispatch)

        td.verify(clearInterval(td.matchers.isA(Object)), { times: 1 })

        // TODO: findout if we need to somehow clear the interval created by actions.startTracker()()
      })
    })
  })

  it('has action for stopping tracker', () => {
    const subj = actions.stopTracker

    expect(subj).to.be.a('function')
  })

  describe('action for stopping tracker', () => {
    it('should call clearInterval with an object', () => {
      const clearInterval = td.replace(global, 'clearInterval')
      const dispatch = () => {}
      actions.stopTracker()

      td.verify(clearInterval(td.matchers.isA(Object)), { times: 1 })
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
})
