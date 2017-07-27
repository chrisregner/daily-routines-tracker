import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import { Link, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
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

  it('should render a PopulatedRoutineList with isSorting prop as false by default', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    expect(wrapper).to.containMatchingElement(<PopulatedRoutineList isSorting={false} />)
  })

  it('should render a react router Link to the page for adding new routine', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    const expectedComponent = wrapper.findWhere(wrpr => (
      wrpr.is(Link) &&
      wrpr.prop('to') === '/routines/new')
    )
    expect(expectedComponent).to.have.lengthOf(1)
  })

  it('should render an h1 with the app name by default', () => {
    const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
    const theH1 = wrapper.find('h1')

    expect(theH1).to.have.text('Daily Routines Tracker')
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

    describe('the \'reset all routines\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsResetAllRoutines')
      })

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

    describe('the \'sort routines\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsSortRoutines')
      })

      context('when \'sort routines\' is pressed', () => {
        it('should set the rendered <PopulatedRoutineList />\'s prop isSorting to true', () => {
          const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
          const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
          const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
          const fakeEv = {
            preventDefault: () => {},
            currentTarget: {
              className: 'jsSortRoutines',
            }
          }

          expect(getPopulatedRoutineList()).to.have.prop('isSorting', false)
          sortBtn.prop('onClick')(fakeEv)
          expect(getPopulatedRoutineList()).to.have.prop('isSorting', true)
        })

        it('should set the h1\'s text to \'Sort Routines\'', () => {
          const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
          const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
          const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
          const fakeEv = {
            preventDefault: () => {},
            currentTarget: {
              className: 'jsSortRoutines',
            }
          }
          const getH1 = () => wrapper.find('h1')

          expect(getH1()).to.not.have.text('Sort Routines')
          sortBtn.prop('onClick')(fakeEv)
          expect(getH1()).to.have.text('Sort Routines')
        })


        it('should replace the menu with \'finish sort routines\' button', () => {
          const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
          const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
          const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
          const fakeEv = {
            preventDefault: () => {},
            currentTarget: {
              className: 'jsSortRoutines',
            }
          }
          const getH1 = () => wrapper.find('h1')

          expect(wrapper).to.have.exactly(1).descendants(Dropdown)
          expect(wrapper).to.have.exactly(0).descendants('.jsFinishSortingRoutines')
          sortBtn.prop('onClick')(fakeEv)
          expect(wrapper).to.have.exactly(0).descendants(Dropdown)
          expect(wrapper).to.have.exactly(1).descendants('.jsFinishSortingRoutines')
        })

        context('when \'sort routines\' button is pressed', () => {
          it('should set the rendered <PopulatedRoutineList />\'s prop isSorting to false', () => {
            const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
            const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
            const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
            const fakeEvForSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsSortRoutines',
              }
            }
            const fakeEvForFinishSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsFinishSortingRoutines',
              }
            }

            const getFinishSortBtn = () => (
              wrapper.find('.jsFinishSortingRoutines')
            )

            sortBtn.prop('onClick')(fakeEvForSortBtn)
            expect(getPopulatedRoutineList()).to.have.prop('isSorting', true)
            getFinishSortBtn().prop('onClick')(fakeEvForFinishSortBtn)
            expect(getPopulatedRoutineList()).to.have.prop('isSorting', false)
          })

          it('should set the h1\'s text to \'Sort Routines\'', () => {
            const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
            const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
            const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
            const fakeEvForSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsSortRoutines',
              }
            }
            const fakeEvForFinishSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsFinishSortingRoutines',
              }
            }

            const getFinishSortBtn = () => (
              wrapper.find('.jsFinishSortingRoutines')
            )
            const getH1 = () => wrapper.find('h1')

            sortBtn.prop('onClick')(fakeEvForSortBtn)
            expect(getH1()).to.not.have.text('Daily Routines Tracker')
            getFinishSortBtn().prop('onClick')(fakeEvForFinishSortBtn)
            expect(getH1()).to.have.text('Daily Routines Tracker')
          })


          it('should replace the menu with \'finish sort routines\' button', () => {
            const wrapper = shallow(<HomePagePure {...getRequiredProps()} />)
            const sortBtn = getMenu(wrapper).find('.jsSortRoutines')
            const getPopulatedRoutineList = () => wrapper.find(PopulatedRoutineList)
            const fakeEvForSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsSortRoutines',
              }
            }
            const fakeEvForFinishSortBtn = {
              preventDefault: () => {},
              currentTarget: {
                className: 'jsFinishSortingRoutines',
              }
            }

            const getFinishSortBtn = () => (
              wrapper.find('.jsFinishSortingRoutines')
            )

            sortBtn.prop('onClick')(fakeEvForSortBtn)
            expect(wrapper).to.have.exactly(0).descendants(Dropdown)
            expect(wrapper).to.have.exactly(1).descendants('.jsFinishSortingRoutines')
            getFinishSortBtn().prop('onClick')(fakeEvForFinishSortBtn)
            expect(wrapper).to.have.exactly(1).descendants(Dropdown)
            expect(wrapper).to.have.exactly(0).descendants('.jsFinishSortingRoutines')
          })
        })
      })
    })
  })
})
