import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Alert, Button, Dropdown, Menu, Modal, Input } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'

import c from 'services/convertVirtualClassNames'
import { nonEmptyObjOfFunc } from 'services/customPropTypes'
import MenuIcon from 'components/MenuIcon'

class ActionBar extends React.Component {
  static propTypes = {
    handlers: nonEmptyObjOfFunc,
    isSorting: PropTypes.bool,
    stateInJson: PropTypes.string,
  }

  state = {
    visibleModal: null,
    importDataFieldVal: '',
    importState: null,
  }

  handleImportData = (ev) => {
    let err

    try {
      this.props.handlers.handleImportData(this.state.importDataFieldVal)
    } catch (theErr) {
      err = theErr
    }

    if (err)
      this.setState({ importState: 'error' })
    else
      this.setState({ importState: 'success' })
  }
  handleImportDataFieldChange = (ev) => { this.setState({ importDataFieldVal: ev.target.value }) }
  handleCopy = () => { this.setState({ hasCopied: true }) }
  handleShowExportModal = (ev) => { this.setState({ visibleModal: 'exportData' }) }
  handleShowImportModal = (ev) => { this.setState({ visibleModal: 'importData' }) }
  handleDismissModal = () => {
    this.setState({
      hasCopied: false,
      importState: null,
      visibleModal: null,
    })
  }
  handleResetAllRoutines = () => { this.props.handlers.handleResetAllRoutines() }
  handleToggleSort = () => { this.props.handlers.handleToggleSort() }

  render = () => (
    <div className='flex items-center pa3 f3'>
      <h1 className='self-grow-1 ma0 f5 dark-gray normal ttu lh-title'>
        {
          this.props.isSorting
          ? (<strong>Sort Routines</strong>)
          : 'Daily Routines Tracker'
        }
      </h1>
      <div>
        {
          this.props.isSorting
          ? (
            <button className={c('jsFinishSort -btn-reset db f6 ttu')} onClick={this.handleToggleSort}>
              Finish Sorting
            </button>
          )
          : (
            <Dropdown
              className='jsActionOverflow'
              placement='bottomRight'
              trigger={['click']}
              overlay={(
                <Menu selectable={false}>
                  <Menu.Item>
                    <Link to='/routines/new'>
                      Add new routine
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={c('jsResetAllRoutines -btn-reset')} onClick={this.handleResetAllRoutines}>
                      Reset all routines
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={c('jsStartSort -btn-reset')} onClick={this.handleToggleSort}>
                      Sort routines
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={c('jsImportDataBtn -btn-reset')} onClick={this.handleShowImportModal}>
                      Import Routines
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className={c('jsExportDataBtn -btn-reset')} onClick={this.handleShowExportModal}>
                      Export Routines
                    </button>
                  </Menu.Item>
                </Menu>
              )}
            >
              <div>
                <MenuIcon />
              </div>
            </Dropdown>
          )
        }
      </div>

      <Modal
        className='jsExportDataModal'
        style={{ top: 70 }}
        title='Export Data'
        visible={this.state.visibleModal === 'exportData'}
        onCancel={this.handleDismissModal}
        footer={(
          <div>
            <Button className='jsExportDataDismiss' onClick={this.handleDismissModal}>
              Dismiss
            </Button>
            <CopyToClipboard
              text={this.props.stateInJson}
              onCopy={this.handleCopy}
            >
              <Button
                className='jsExportDataCopy'
                type='primary'
              >
                Copy to Clipboard
              </Button>
            </CopyToClipboard>
          </div>
        )}
      >
        {
          this.state.hasCopied &&
          <Alert
            className='mb2'
            message='Copied to clipboard'
            type='success'
            showIcon
          />
        }
        <p className='mb3 f6 lh-copy'>
          Please copy the text below. You can use it by clicking ‘Import Data’ button (just below
          the ‘Export Data’ button) and pasting the text in the textbox that will appear.
        </p>
        <Input.TextArea value={this.props.stateInJson} rows={4} readOnly />
      </Modal>

      <Modal
        className='jsImportDataModal'
        style={{ top: 70 }}
        title='Import Data'
        visible={this.state.visibleModal === 'importData'}
        onOk={this.handleImportData}
        onCancel={this.handleDismissModal}
        okText='Import'
        cancelText='Dismiss'
      >
        {
          this.state.importState === 'success' &&
          <Alert
            className='mb2'
            message='Data import success'
            type='success'
            showIcon
          />
        }
        {
          this.state.importState === 'error' &&
          <Alert
            className='mb2'
            message='Data import failed. Please ensure that the export data is copied properly'
            type='error'
            showIcon
          />
        }
        {<p className='mb3 f6 lh-copy'>
          Please paste the exported data text below. You access the exported data by clicking Export Data’ button (just above
          the ‘Export Data’ button)
        </p>}
        <div className={c(this.state.importState === 'error' && 'has-error')}>
          <Input.TextArea
            className='jsImportDataField'
            value={this.state.importDataFieldVal}
            onChange={this.handleImportDataFieldChange}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ActionBar
