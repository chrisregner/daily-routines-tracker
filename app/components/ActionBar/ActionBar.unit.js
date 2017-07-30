import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import { Link, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Dropdown } from 'antd'
import merge from 'lodash/merge'

import ActionBar from './ActionBar'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'

describe('Component: ActionBar', () => {
  const getRequiredProps = (passedProps) => {
    const requiredProps = {
      isSorting: false,
      handlers: {
        handleResetAllRoutines: () => {}
      }
    }

    return passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps
  }

  it('should render without crashing', () => {
    const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
    expect(wrapper).to.be.present()
  })

  it('should render an h1 with the app name by default', () => {
    const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
    const theH1 = wrapper.find('h1')

    expect(theH1).to.have.text('Daily Routines Tracker')
  })

  describe('action overflow menu', () => {
    const getMenu = (passedRootCompWrapper) => {
      const rootCompWrapper = passedRootCompWrapper || shallow(<ActionBar {...getRequiredProps()} />)
      const extractedMenu = rootCompWrapper
        .find('.jsActionOverflow')
        .prop('overlay')
      const ExtractedMenu = () => extractedMenu
      const extractedMenuWrapper = shallow(
        <MemoryRouter>
          <ExtractedMenu />
        </MemoryRouter>
      )

      return extractedMenuWrapper.find(ExtractedMenu).dive()
    }

    it('should render and should be an AntD Dropdown', () => {
      const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
      expect(wrapper.find('.jsActionOverflow')).to.match(Dropdown)
    })

    it('should have a menu item that is a react-router Link to add new routine', () => {
      const wrapper = getMenu()
      const expectedComponent = wrapper.findWhere(wrpr => (
        wrpr.is(Link) &&
        wrpr.prop('to') === '/routines/new')
      )

      expect(expectedComponent).to.have.lengthOf(1)
    })

    describe('the \'reset all routines\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsResetAllRoutines')
      })

      it('should call the passed handlers.handleResetAllRoutines() when pressed', () => {
        const fakeHandleResetAllRoutines = td.function()
        const rootCompWrapper = shallow(
          <ActionBar {...getRequiredProps({
            handlers: {
              handleResetAllRoutines: fakeHandleResetAllRoutines
            }
          })} />
        )
        const menuWrapper = getMenu(rootCompWrapper)

        const resetAllRoutineBtn = menuWrapper.find('.jsResetAllRoutines')

        const fakeEv = {
          preventDefault: () => {},
          currentTarget: {
            className: 'jsResetAllRoutines',
          }
        }

        td.verify(fakeHandleResetAllRoutines(), { times: 0, ignoreExtraArgs: 0 })
        resetAllRoutineBtn.prop('onClick')(fakeEv)
        td.verify(fakeHandleResetAllRoutines(), { times: 1 })
      })
    })

    describe('the \'sort routines\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsStartSort')
      })

      context('when \'sort routines\' is pressed', () => {
        it('should call the passed handlers.handleToggleSort() when pressed', () => {
          const fakeHandleToggleSort = td.function()
          const rootCompWrapper = shallow(
            <ActionBar {...getRequiredProps({
              handlers: {
                handleToggleSort: fakeHandleToggleSort
              }
            })} />
          )
          const menuWrapper = getMenu(rootCompWrapper)

          const startSortBtn = menuWrapper.find('.jsStartSort')

          const fakeEv = {
            preventDefault: () => {},
            currentTarget: {
              className: 'jsStartSort',
            }
          }

          td.verify(fakeHandleToggleSort(), { times: 0, ignoreExtraArgs: 0 })
          startSortBtn.prop('onClick')(fakeEv)
          td.verify(fakeHandleToggleSort(), { times: 1 })
        })
      })
    })
  })


  context('when isSorting prop is false', () => {
    it('should set the h1\'s text to \'Daily Routines Tracker\'', () => {
      const wrapper = shallow(<ActionBar {...getRequiredProps({ isSorting: false })} />)
      expect(wrapper.find('h1')).to.have.text('Daily Routines Tracker')
    })

    it('should render menu button and NOT render \'finish sort routines\' button', () => {
      const wrapper = shallow(<ActionBar {...getRequiredProps({ isSorting: false })} />)
      expect(wrapper).to.have.exactly(1).descendants(Dropdown)
      expect(wrapper).to.have.exactly(0).descendants('.jsFinishSort')
    })
  })

  context('when isSorting prop is true', () => {
    it('should set the h1\'s text to \'Sort Routines\'', () => {
      const wrapper = shallow(<ActionBar {...getRequiredProps({ isSorting: true })} />)
      expect(wrapper.find('h1')).to.contain('Sort Routines')
    })

    it('should render menu button and NOT render \'finish sort routines\' button', () => {
      const wrapper = shallow(<ActionBar {...getRequiredProps({ isSorting: true })} />)
      expect(wrapper).to.have.exactly(0).descendants(Dropdown)
      expect(wrapper).to.have.exactly(1).descendants('.jsFinishSort')
    })
  })

  describe('the \'finish sort\' button', () => {
    it('should call the passed handlers.handleToggleSort() when pressed', () => {
      const fakeHandleToggleSort = td.function()
      const wrapper = shallow(
        <ActionBar {...getRequiredProps({
          handlers: {
            handleToggleSort: fakeHandleToggleSort
          },
          isSorting: true,
        })} />
      )

      const finishSortBtn = wrapper.find('.jsFinishSort')

      const fakeEv = {
        preventDefault: () => {},
        currentTarget: {
          className: 'jsFinishSort',
        }
      }

      td.verify(fakeHandleToggleSort(), { times: 0, ignoreExtraArgs: 0 })
      finishSortBtn.prop('onClick')(fakeEv)
      td.verify(fakeHandleToggleSort(), { times: 1 })
    })
  })
})
