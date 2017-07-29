import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import td from 'testdouble'
import merge from 'lodash/merge'

import configureMockStore  from 'redux-mock-store'

describe('CONTAINER: DoneRoutinesNotifier', () => {
  let DoneRoutinesNotifier, PureDoneRoutinesNotifier
  const getMockStore = configureMockStore()

  const createWrapper = (passedProps) => {
    const initialState = { routines: [] }
    const requiredProps = {
      store: getMockStore(initialState),
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(<DoneRoutinesNotifier {...finalProps} />)
  }

  const createUnconnectedWrapper = (passedProps, shouldUseMount) => {
    const requiredProps = {
      handleClearNotifs: () => {},
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    if (shouldUseMount)
      return mount(<PureDoneRoutinesNotifier {...finalProps} />)
    return shallow(<PureDoneRoutinesNotifier {...finalProps} />)
  }

  beforeEach(() => {
    DoneRoutinesNotifier = require('./DoneRoutinesNotifier').default
    PureDoneRoutinesNotifier = require('./DoneRoutinesNotifier').PureDoneRoutinesNotifier
  })

  afterEach(() => {
    td.reset()
    document.body.innerHTML = ''
  })

  it('should render without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper).to.be.present()
  })

  it('should have the correct RoutinesThatShouldNotify prop', () => {
    const props = {
      store: getMockStore({
        routines: [
          {
            id: '1',
            routineName: 'First routine',
            shouldNotify: true,
          },
          {
            id: '2',
            routineName: 'Second routine',
          },
          {
            id: '3',
            routineName: 'Third routine',
            shouldNotify: true,
          },
        ]
      })
    }
    const wrapper = createWrapper(props)

    const expectedProp = [
      {
        id: '1',
        routineName: 'First routine',
        shouldNotify: true,
      },
      {
        id: '3',
        routineName: 'Third routine',
        shouldNotify: true,
      },
    ]

    expect(wrapper).to.have.prop('RoutinesThatShouldNotify').deep.equal(expectedProp)
  })

  it('should have handleClearNotifs() prop that dispatches clearNotifs()', () => {
    const clearNotifs = td.function()
    td.replace('duck/actions', { clearNotifs })
    const clearNotifsRes = '123'
    td.when(clearNotifs()).thenReturn(clearNotifsRes)

    DoneRoutinesNotifier = require('./DoneRoutinesNotifier').default

    const initialState = { routines: [] }
    const mockStore = getMockStore(initialState)
    const dispatch = td.replace(mockStore, 'dispatch')

    const wrapper = createWrapper({ store: mockStore })

    td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
    wrapper.prop('handleClearNotifs')()
    td.verify(dispatch(clearNotifsRes), { times: 1 })
  })

  describe('lifecycle componentDidMount()', () => {
    it('should call Howler that will set the component\'s notifSound when its loaded', () => {
      let todoWhenNotifIsLoaded
      class FakeHowl {
        once = (...args) => {
          todoWhenNotifIsLoaded = args[1]
        }
      }

      const Howl = () => HowlRes
      td.replace('howler', { Howl: FakeHowl })
      PureDoneRoutinesNotifier = require('./DoneRoutinesNotifier').PureDoneRoutinesNotifier

      const wrapper = createUnconnectedWrapper()
      wrapper.instance().componentDidMount()

      expect(wrapper).to.have.state('notifSound', null)

      // this simulates the notifSound being loaded
      todoWhenNotifIsLoaded()

      expect(wrapper.state('notifSound')).to.be.instanceof(FakeHowl)
    })
  })

  describe('lifecycle componentDidUpdate()', () => {
    it(
      'when the sound is loaded, one or more routines should notify, and the sound is not ' +
      'playing yet, it should play the sound',
      () => {
        const fakePlay = td.function()
        const wrapper = createUnconnectedWrapper({
          RoutinesThatShouldNotify: [
            { routineName: 'Routine One' },
            { routineName: 'Routine Two' }
          ]
        })

        const extractedComponentDidUpdate = wrapper.instance().componentDidUpdate
        td.replace(wrapper.instance(), 'componentDidUpdate')

        wrapper.setState({
          notifSound: { play: fakePlay }
        })

        td.verify(fakePlay(), { times: 0 })
        extractedComponentDidUpdate()
        td.verify(fakePlay(), { times: 1 })
      }
    )

    it(
      'when the sound is loaded, one or more routines should notify, and the sound is not ' +
      'playing yet, show a modal with the routineName of first routine that should notify',
      () => {
        const wrapper = createUnconnectedWrapper(
          {
            RoutinesThatShouldNotify: [
              { routineName: 'Unique Routine Name' },
              { routineName: 'Routine Two' }
            ]
          }
        )

        const extractedComponentDidUpdate = wrapper.instance().componentDidUpdate
        td.replace(wrapper.instance(), 'componentDidUpdate')

        wrapper.setState({
          notifSound: { play: () => {} }
        })

        expect(document.body.innerHTML).to.equal('')
        extractedComponentDidUpdate()
        expect(document.body.innerHTML).to.contain('Unique Routine Name')
      }
    )


    /**
     * Skip this test, so far it seems to be too much of work.
     *
     * (1) We can't test it by spying on the third party (AntD) modal renderer because
     * td.replace() seems to have its own problem with the babel-plugin-import module which we
     * need for Antd.
     *
     * (2) We can't also test it by (2) clicking on actual DOM inserted by AntD Modal renderer
     * into JSDOM because React (as used by AntD) has its own problems with fake DOM of JSDOM.
     */
    it.skip(
      'when the sound is loaded, one or more routines should notify, and the sound is not ' +
      'playing yet, show a modal that calls the handleClearNotifs() prop when its dismiss button ' +
      'is pressed',
      () => {

        const getDismissButton = () => {
          const buttonEls = Object.values(document.getElementsByTagName('button'))

          return buttonEls.find((buttonEl) => buttonEl.innerHTML.includes('Dismiss'))
        }

        const FakeHandleClearNotifs = td.function()
        const wrapper = createUnconnectedWrapper(
          {
            handleClearNotifs: FakeHandleClearNotifs,
            RoutinesThatShouldNotify: [
              { routineName: 'Unique Routine Name' },
              { routineName: 'Routine Two' }
            ]
          }
        )

        const extractedComponentDidUpdate = wrapper.instance().componentDidUpdate
        td.replace(wrapper.instance(), 'componentDidUpdate')

        wrapper.setState({
          notifSound: { play: () => {} }
        })

        extractedComponentDidUpdate()
        td.verify(FakeHandleClearNotifs(), { times: 0, ignoreExtraArgs: true })
        getDismissButton().click()
        td.verify(FakeHandleClearNotifs(), { times: 1, ignoreExtraArgs: true })
      }
    )

    it(
      'when the sound is loaded, one or more routines should notify, and the sound is playing ' +
      'already, it should NOT play the sound again',
      () => {
        const fakePlay = td.function()
        const wrapper = createUnconnectedWrapper({
          RoutinesThatShouldNotify: [
            { routineName: 'Routine One' },
            { routineName: 'Routine Two' }
          ]
        })

        const extractedComponentDidUpdate = wrapper.instance().componentDidUpdate

        td.replace(wrapper.instance(), 'componentDidUpdate')

        wrapper.setState({
          isPlaying: false,
          notifSound: { play: fakePlay }
        })

        // after the next line, the sound is considered playing already
        extractedComponentDidUpdate()
        td.verify(fakePlay(), { times: 1 })

        // now call the componenedDidUpdate() again
        extractedComponentDidUpdate()

        // call times should still be 1 since it is playing already
        td.verify(fakePlay(), { times: 1 })
      }
    )

    it('when the sound is playing but no routines needs to notify, it should stop the sound', () => {
      const fakeNotifSound = td.object('play', 'stop')
      const wrapper = createUnconnectedWrapper({
        RoutinesThatShouldNotify: [
          { routineName: 'Routine One' },
          { routineName: 'Routine Two' }
        ]
      })

      const extractedComponentDidUpdate = wrapper.instance().componentDidUpdate

      td.replace(wrapper.instance(), 'componentDidUpdate')

      wrapper.setState({
        isPlaying: false,
        notifSound: fakeNotifSound
      })

      // after the next line, fake play should be called (i.e. it is 'playing')
      extractedComponentDidUpdate()
      td.verify(fakeNotifSound.play(), { times: 1 })

      // now remove the routines that should notify then call the componenedDidUpdate() again
      wrapper.setProps({ RoutinesThatShouldNotify: [] })
      extractedComponentDidUpdate()

      // it should call the fake stop
      td.verify(fakeNotifSound.stop(), { times: 1 })
    })
  })
})