import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import { Link, MemoryRouter } from 'react-router-dom'
import { Dropdown } from 'antd'
import merge from 'lodash/merge'

import HomePagePure from './HomePagePure'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'

describe('Page: HomePagePure', () => {
  const getRequiredProps = (passedProps) => {
    const requiredProps = {
      handlers: {
        handleResetAllRoutines: () => {}
      }
    }

    return passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps
  }

  it('should have <div /> as its root component', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    expect(wrapper).to.match('div')
  })

  it('should render a PopulatedRoutineList', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    expect(wrapper).to.containMatchingElement(<PopulatedRoutineList />)
    expect(wrapper).to.have.exactly(1).descendants(PopulatedRoutineList)
  })

  it('should render a react router Link to the page for adding new routine', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    const expectedComponent = wrapper.findWhere(wrpr => (
      wrpr.is(Link) &&
      wrpr.prop('to') === '/routines/new')
    )
    expect(expectedComponent).to.have.lengthOf(1)
  })

  describe('action overflow menu', () => {
    it('should render and should be an AntD Dropdown', () => {
      const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
      expect(wrapper.find('.jsActionOverflow')).to.match(Dropdown)
    })

    const getMenu = (passedRootCompWrapper) => {
      const rootCompWrapper = passedRootCompWrapper || shallow(<HomePagePure {...getRequiredProps()} />)
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

    it('should have a menu item that is a react-router Link to add new routine', () => {
      const wrapper = getMenu()
      const expectedComponent = wrapper.findWhere(wrpr => (
        wrpr.is(Link) &&
        wrpr.prop('to') === '/routines/new')
      )

      expect(expectedComponent).to.have.lengthOf(1)
    })

    it('should have a menu item that contains \'reset all routines\' button', () => {
      const wrapper = getMenu()
      expect(wrapper).to.have.exactly(1).descendants('.jsResetAllRoutines')
    })

    describe('the \'reset all routines\' button', () => {
      it('should have a menu item that contains \'reset all routines\' button', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsResetAllRoutines')
      })

      describe('\'reset all routines\' button', () => {
        it('should call the passed handlers.handleResetAllRoutines() when pressed', () => {
          const handleResetAllRoutines = td.function()
          const rootCompWrapper = shallow(
            <HomePagePure {...getRequiredProps({
              handlers: {
                handleResetAllRoutines
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

          td.verify(handleResetAllRoutines(), { times: 0, ignoreExtraArgs: 0 })
          resetAllRoutineBtn.prop('onClick')(fakeEv)
          td.verify(handleResetAllRoutines(), { times: 1 })
        })
      })
    })
  })
})
