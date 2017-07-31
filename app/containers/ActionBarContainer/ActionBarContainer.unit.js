import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import createMomentDerivedFromIso from 'services/createMomentDerivedFromIso'
import ActionBar from 'components/ActionBar'
import { resetAllRoutines, toggleSort } from 'duck/actions'

describe('CONTAINER: ActionBar', () => {
  let ActionBarContainer
  const getMockStore = configureMockStore()
  const createInstance = (passedProps) => {
    const initialState = {
      isSorting: false,
      routines: []
    }
    const requiredProps = {
      store: getMockStore(initialState),
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(
      <MemoryRouter>
        <ActionBarContainer {...finalProps} />
      </MemoryRouter>
    )
      .find(ActionBarContainer)
  }

  beforeEach(() => {
    ActionBarContainer = require('./ActionBarContainer').default
  })

  afterEach(() => { td.reset() })

  it('should render <ActionBar /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(ActionBar)
  })

  describe('the rendered <ActionBar />', () => {
    it('should receive isSorting from state as prop', () => {
      const testWithIsSortingSetTo = (isSorting) => {
        const initialState = {
          isSorting: isSorting
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('isSorting', isSorting)
      }

      testWithIsSortingSetTo(true)
      testWithIsSortingSetTo(false)
    })

    it('should receive stateInJson that is the routines in JSON format', () => {
        const initialState = {
          isSorting: true,
          routines: [
            {
              id: '1',
              routineName: 'Routine One',
              duration: new Date(),
              timeLeft: null,
              isTracking: false,
              isDone: false,
            },
            {
              id: '2',
              routineName: 'Routine Two',
              duration: new Date(),
              timeLeft: null,
              isDone: true,
            }
          ]
        }
        const wrapper = createInstance({
          store: getMockStore(initialState),
        })

        const expected = JSON.stringify(initialState.routines)
        const actual = wrapper.dive().prop('stateInJson')

        expect(actual).to.equal(expected)
    })

    describe('handlers {} prop', () => {
      it('should be an object passed to <RoutineList />', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent.prop('handlers')).to.be.an('object')
      })

      it('should have the handleResetAllRoutines() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleResetAllRoutines

        expect(subj).to.be.a('function')
      })

      describe('handleResetAllRoutines()', () => {
        it('should call dispatch() with resetAllRoutines()\'s result when called', () => {
          const resetAllRoutines = td.function()
          td.replace('duck/actions', { resetAllRoutines })
          const resetAllRoutinesRes = '123'
          td.when(resetAllRoutines()).thenReturn(resetAllRoutinesRes)

          ActionBarContainer = require('./ActionBarContainer').default

          const initialState = { routines: [] }
          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleResetAllRoutines()
          td.verify(dispatch(resetAllRoutinesRes), { times: 1 })
        })
      })

      it('should have the handleToggleSort() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subj = wrappedComponent.prop('handlers').handleToggleSort

        expect(subj).to.be.a('function')
      })

      describe('handleToggleSort()', () => {
        it('should call dispatch() with toggleSort()\'s result when called', () => {
          const toggleSort = td.function()
          td.replace('duck/actions', { toggleSort })
          const toggleSortRes = '123'
          td.when(toggleSort()).thenReturn(toggleSortRes)

          ActionBarContainer = require('./ActionBarContainer').default

          const initialState = { routines: [] }
          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handlers').handleToggleSort()
          td.verify(dispatch(toggleSortRes), { times: 1 })
        })
      })

      it('should have the handleImportData() property', () => {
        const wrapper = createInstance()
        const wrappedComponent = wrapper.dive()
        const subject = wrappedComponent.prop('handlers').handleImportData

        expect(subject).to.be.a('function')
      })

      describe('handleImportData()', () => {
        context('if the passed JSON string passes the scheme validation', () => {
          it(
            'should call dispatch() with setRoutines()\'s result when called with ' +
            'handleImportData()\'s JSON-serialized first argument',
            () => {
              const setRoutines = td.function()
              td.replace('duck/actions', { setRoutines })
              const setRoutinesArg = {
                routines: [
                  {
                    id: '1',
                    routineName: 'Routine One',
                    duration: createMomentDerivedFromIso('12:34:56.789', 'HH:mm:ss.SSS'),
                    isTracking: false,
                    timeLeft: null,
                    isDone: false,
                    shouldNotify: false
                  },
                  {
                    id: '2',
                    routineName: 'Routine Two',
                    duration: null,
                    timeLeft: null,
                  }
                ]
              }
              const setRoutinesRes = 'setRoutinesRes'
              td.when(setRoutines(setRoutinesArg)).thenReturn(setRoutinesRes)

              ActionBarContainer = require('./ActionBarContainer').default

              const mockStore = getMockStore({
                routines: [],
                isSorting: false
              })

              const dispatch = td.replace(mockStore, 'dispatch')
              const wrapper = createInstance({ store: mockStore })
              const wrappedComponent = wrapper.dive()
              const passedArg = setRoutinesArg

              td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
              wrappedComponent.prop('handlers').handleImportData(JSON.stringify(setRoutinesArg))
              td.verify(dispatch(setRoutinesRes), { times: 1 })
            }
          )
        })

        context('if the passed JSON string doesn\'t pass the scheme validation', () => {
          it('should throw an error and not call dispatch()', () => {
            const dataToImport = {
              routines: [
                {
                  id: '1',
                  routineName: 'Routine One',
                  duration: 'thisShouldHaveBeenAMomentObj',
                  isTracking: false,
                  timeLeft: null,
                  isDone: false,
                  shouldNotify: false
                },
                {
                  id: '2',
                  routineName: 123,
                }
              ]
            }

            const mockStore = getMockStore({
              routines: [],
              isSorting: false
            })

            const dispatch = td.replace(mockStore, 'dispatch')
            const wrapper = createInstance({ store: mockStore })
            const wrappedComponent = wrapper.dive()
            const callHandleImportData = () => {
              wrappedComponent.prop('handlers').handleImportData(JSON.stringify(dataToImport))
            }

            expect(callHandleImportData).to.throw()
            td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          })
        })
      })
    })

  })
})
