import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import { Link, MemoryRouter } from 'react-router-dom'
import { Alert, Dropdown, Input } from 'antd'
import merge from 'lodash/merge'
import CopyToClipboard from 'react-copy-to-clipboard'

import ActionBar from './ActionBar'

describe('Component: ActionBar', () => {
  const getRequiredProps = (passedProps) => {
    const requiredProps = {
      isSorting: false,
      stateInJson: 'fallBackStateInJson',
      handlers: {
        handleResetAllRoutines: () => {},
        handleImportData: () => {},
      },
    }

    return passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps
  }

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

  const findCopyAlert = (wrpr) => (
    wrpr
      .find('.jsExportDataModal')
      .findWhere((_wrpr) => (
        _wrpr.is(Alert) &&
        _wrpr.prop('message').includes('Copied')
      ))
  )

  const getExportDataModalFooter = (passedRootCompWrapper) => {
    const rootCompWrapper = passedRootCompWrapper || shallow(<ActionBar {...getRequiredProps()} />)
    const extractedFooter = rootCompWrapper
      .find('.jsExportDataModal')
      .prop('footer')
    const ExtractedFooter = () => extractedFooter
    const extractedFooterWrapper = shallow(<ExtractedFooter />)

    return extractedFooterWrapper
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
              handleResetAllRoutines: fakeHandleResetAllRoutines,
            },
          })} />
        )
        const menuWrapper = getMenu(rootCompWrapper)

        const resetAllRoutineBtn = menuWrapper.find('.jsResetAllRoutines')

        const fakeEv = {
          preventDefault: () => {},
          currentTarget: {
            className: 'jsResetAllRoutines',
          },
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
                handleToggleSort: fakeHandleToggleSort,
              },
            })} />
          )
          const menuWrapper = getMenu(rootCompWrapper)

          const startSortBtn = menuWrapper.find('.jsStartSort')

          const fakeEv = {
            preventDefault: () => {},
            currentTarget: {
              className: 'jsStartSort',
            },
          }

          td.verify(fakeHandleToggleSort(), { times: 0, ignoreExtraArgs: 0 })
          startSortBtn.prop('onClick')(fakeEv)
          td.verify(fakeHandleToggleSort(), { times: 1 })
        })
      })
    })

    describe('the \'export data\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsExportDataBtn')
      })

      it('should show the \'export data\' modal when pressed', () => {
        const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
        const menuWrapper = getMenu(rootWrapper)

        expect(rootWrapper.find('.jsExportDataModal')).to.have.prop('visible', false)
        menuWrapper.find('.jsExportDataBtn').simulate('click')
        expect(rootWrapper.find('.jsExportDataModal')).to.have.prop('visible', true)
      })

      describe('the \'export data\' modal', () => {
        it('should contain the stateInJson prop', () => {
          const passedStateInJson = 'My Unique State in JSON'
          const rootWrapper = shallow(
            <ActionBar {...getRequiredProps({ stateInJson: passedStateInJson })} />
          )
          const elWithStateInJson = rootWrapper.find('.jsExportDataModal')
              .findWhere((wrpr) => wrpr.prop('value') === passedStateInJson)

          expect(elWithStateInJson).to.have.lengthOf(1)
        })

        describe('\'copy to clipboard\' button', () => {
          it('should render one of it', () => {
            const wrapper = getExportDataModalFooter()
            expect(wrapper).to.have.exactly(1).descendants('.jsExportDataCopy')
          })

          it('should have a button whose parent is <CopyToClipboard /> with correct props', () => {
            const passedStateInJson = 'My Unique State in JSON'
            const rootWrapper = shallow(
              <ActionBar {...getRequiredProps({ stateInJson: passedStateInJson })} />
            )
            const wrapper = getExportDataModalFooter(rootWrapper)
            const expectedParent = wrapper.findWhere((wrpr) => (
              wrpr.is(CopyToClipboard) && wrpr.prop('text') === passedStateInJson
            ))

            expect(expectedParent).to.have.lengthOf(1)
          })

          it('should show the alert \'Copied\' in the modal when used', () => {
            const passedStateInJson = 'My Unique State in JSON'
            const rootWrapper = shallow(
              <ActionBar {...getRequiredProps({ stateInJson: passedStateInJson })} />
            )
            const wrapper = getExportDataModalFooter(rootWrapper)
            const copyToClipboardComp = wrapper.find('.jsExportDataCopy').parent()

            expect(findCopyAlert(rootWrapper)).to.have.lengthOf(0)
            copyToClipboardComp.prop('onCopy')()
            expect(findCopyAlert(rootWrapper)).to.have.lengthOf(1)
          })
        })

        describe('handleDismissModal()', () => {
          it('should be a function', () => {
            const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
            expect(wrapper.instance().handleDismissModal).to.be.a('function')
          })

          it('should hide the alert \'Copied\' from modal', () => {
            const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
            const modalFooterWrapper = getExportDataModalFooter(rootWrapper)
            const copyToClipboardComp = modalFooterWrapper.find('.jsExportDataCopy').parent()

            copyToClipboardComp.prop('onCopy')()
            expect(findCopyAlert(rootWrapper)).to.have.lengthOf(1)
            rootWrapper.instance().handleDismissModal()
            expect(findCopyAlert(rootWrapper)).to.have.lengthOf(0)
          })

          it('should hide the modal', () => {
            const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
            const menuWrapper = getMenu(rootWrapper)

            menuWrapper.find('.jsExportDataBtn').simulate('click')
            expect(rootWrapper.find('.jsExportDataModal')).to.have.prop('visible', true)
            rootWrapper.instance().handleDismissModal()
            expect(rootWrapper.find('.jsExportDataModal')).to.have.prop('visible', false)
          })

          it('should be passed to the Modal', () => {
            const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
            const handleDismissModal = wrapper.instance().handleDismissModal
            const modalWrapper = wrapper.find('.jsExportDataModal')

            expect(modalWrapper).to.have.prop('onCancel', handleDismissModal)
          })

          it('should be passed to the dismiss button', () => {
            const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
            const handleDismissModal = rootWrapper.instance().handleDismissModal
            const dismissBtnWrapper = getExportDataModalFooter(rootWrapper).find('.jsExportDataDismiss')

            expect(dismissBtnWrapper).to.have.prop('onClick', handleDismissModal)
          })
        })
      })
    })

    describe('the \'import data\' button', () => {
      it('should render one of it in the menu', () => {
        const wrapper = getMenu()
        expect(wrapper).to.have.exactly(1).descendants('.jsImportDataBtn')
      })

      it('should show the \'import data\' modal when pressed', () => {
        const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
        const menuWrapper = getMenu(rootWrapper)

        expect(rootWrapper.find('.jsImportDataModal')).to.have.prop('visible', false)
        menuWrapper.find('.jsImportDataBtn').simulate('click')
        expect(rootWrapper.find('.jsImportDataModal')).to.have.prop('visible', true)
      })

      describe('the \'import data\' modal', () => {
        it('should contain an AntD <Input.TextArea />', () => {
          const wrapper = shallow(<ActionBar {...getRequiredProps()} />)

          expect(wrapper.find('.jsImportDataModal')).to.have.exactly(1).descendants(Input.TextArea)
        })

        describe('the Antd <Input.TextArea />', () => {
          it('should be a controlled input', () => {
            const wrapper = shallow(<ActionBar {...getRequiredProps()} />)
            const inputData = 'Unique Input Data'

            wrapper.find('.jsImportDataField').simulate('change', {
              target: {
                value: inputData,
              },
            })

            expect(wrapper.find('.jsImportDataField')).to.have.prop('value', inputData)
          })
        })

        describe('the \'onCancel\' handler of \'import data\' modal', () => {
          const rootWrapper = shallow(<ActionBar {...getRequiredProps()} />)
          const menuWrapper = getMenu(rootWrapper)

          menuWrapper.find('.jsImportDataBtn').simulate('click')
          expect(rootWrapper.find('.jsImportDataModal')).to.have.prop('visible', true)
          rootWrapper.find('.jsImportDataModal').prop('onCancel')()
          expect(rootWrapper.find('.jsImportDataModal')).to.have.prop('visible', false)
        })

        describe('the \'onOk\' handler of \'import data\' modal', () => {
          it('should call the handlers.handleImport() prop with the TextArea value', () => {
            const fakeHandleImportData = td.function()
            const wrapper = shallow(
              <ActionBar {...getRequiredProps({
                handlers: {
                  handleImportData: fakeHandleImportData,
                },
              })} />
            )
            const inputData = 'Unique Input Data'

            wrapper.find('.jsImportDataField').simulate('change', {
              target: {
                value: inputData,
              },
            })

            td.verify(fakeHandleImportData(inputData), { times: 0 })
            wrapper.find('.jsImportDataModal').prop('onOk')()

            td.verify(fakeHandleImportData(inputData), { times: 1 })
          })

          context('when handlers.handleImport()', () => {
            it('should display the import success alert', () => {
              const fakeHandleImportData = td.function()
              const wrapper = shallow(
                <ActionBar {...getRequiredProps({
                  handlers: {
                    handleImportData: fakeHandleImportData,
                  },
                })} />
              )
              const inputData = 'Unique Input Data'

              wrapper.find('.jsImportDataField').simulate('change', {
                target: {
                  value: inputData,
                },
              })

              const findAlert = (wrpr) => wrpr.find('.jsImportDataModal').find(Alert)

              expect(findAlert(wrapper)).to.have.lengthOf(0)
              wrapper.find('.jsImportDataModal').prop('onOk')()
              expect(findAlert(wrapper)).to.have.lengthOf(1)
              expect(findAlert(wrapper)).to.have.prop('type', 'success')
            })

            it('should hide the alert on modal dismiss', () => {
              const fakeHandleImportData = td.function()
              const wrapper = shallow(
                <ActionBar {...getRequiredProps({
                  handlers: {
                    handleImportData: fakeHandleImportData,
                  },
                })} />
              )
              const inputData = 'Unique Input Data'

              wrapper.find('.jsImportDataField').simulate('change', {
                target: {
                  value: inputData,
                },
              })

              wrapper.find('.jsImportDataModal').prop('onOk')()
              expect(wrapper.find('.jsImportDataModal')).to.have.exactly(1).descendants(Alert)
              wrapper.find('.jsImportDataModal').prop('onCancel')()
              expect(wrapper.find('.jsImportDataModal')).to.have.exactly(0).descendants(Alert)
            })
          })

          context('when handlers.handleImport() prop throws an error', () => {
            it('should display the import error alert', () => {
              const fakeHandleImportData = td.function()
              td.when(fakeHandleImportData(td.matchers.anything())).thenThrow(new Error())

              const wrapper = shallow(
                <ActionBar {...getRequiredProps({
                  handlers: {
                    handleImportData: fakeHandleImportData,
                  },
                })} />
              )
              const inputData = 'Unique Input Data'

              wrapper.find('.jsImportDataField').simulate('change', {
                target: {
                  value: inputData,
                },
              })

              const findAlert = (wrpr) => wrpr.find('.jsImportDataModal').find(Alert)

              expect(findAlert(wrapper)).to.have.lengthOf(0)
              wrapper.find('.jsImportDataModal').prop('onOk')()
              expect(findAlert(wrapper)).to.have.lengthOf(1)
              expect(findAlert(wrapper)).to.have.prop('type', 'error')
            })

            it('should hide the alert on modal dismiss', () => {
              const fakeHandleImportData = td.function()
              const wrapper = shallow(
                <ActionBar {...getRequiredProps({
                  handlers: {
                    handleImportData: fakeHandleImportData,
                  },
                })} />
              )
              const inputData = 'Unique Input Data'

              wrapper.find('.jsImportDataField').simulate('change', {
                target: {
                  value: inputData,
                },
              })

              td.when(fakeHandleImportData(td.matchers.anything())).thenThrow(new Error())
              wrapper.find('.jsImportDataModal').prop('onOk')()
              expect(wrapper.find('.jsImportDataModal')).to.have.exactly(1).descendants(Alert)
              wrapper.find('.jsImportDataModal').prop('onCancel')()
              expect(wrapper.find('.jsImportDataModal')).to.have.exactly(0).descendants(Alert)
            })
          })
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
            handleToggleSort: fakeHandleToggleSort,
          },
          isSorting: true,
        })} />
      )

      const finishSortBtn = wrapper.find('.jsFinishSort')

      const fakeEv = {
        preventDefault: () => {},
        currentTarget: {
          className: 'jsFinishSort',
        },
      }

      td.verify(fakeHandleToggleSort(), { times: 0, ignoreExtraArgs: 0 })
      finishSortBtn.prop('onClick')(fakeEv)
      td.verify(fakeHandleToggleSort(), { times: 1 })
    })
  })
})
