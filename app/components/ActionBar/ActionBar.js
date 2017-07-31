import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Alert, Icon, Button, Dropdown, Menu, Modal, Input } from 'antd'
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
  }

  handleCopy = () => { this.setState({ hasCopied: true }) }
  handleShowExportModal = (e) => { this.setState({ visibleModal: 'exportData' }) }
  handleDismissModal = () => {
    this.setState({
      hasCopied: false,
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
                    <button className={c('-btn-reset')}>
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
        title="Export Data"
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
                type="primary"
              >
                Copy to Clipboard
              </Button>
            </CopyToClipboard>
          </div>
        )}
      >
        {
          this.state.hasCopied
          && <Alert
            className='mb2'
            message="Copied to clipboard"
            type="success"
            showIcon
          />
        }
        <p className='mb3 f6 lh-copy'>
          Please copy the text below. You can use it by clicking ‘Import Data’ button (just below
          the ‘Export Data’ button) and pasting the text in the textbox that will appear.
        </p>
        <Input.TextArea value={this.props.stateInJson} rows={4} readOnly />
      </Modal>
    </div>
  )
}

export default ActionBar
