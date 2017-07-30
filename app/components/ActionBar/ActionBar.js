import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu } from 'antd'

import c from 'services/convertVirtualClassNames'
import { nonEmptyObjOfFunc } from 'services/customPropTypes'
import MenuIcon from 'components/MenuIcon'

class ActionBar extends React.Component {
  static propTypes = {
    handlers: nonEmptyObjOfFunc,
    isSorting: PropTypes.bool,
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
                    <button className={c('-btn-reset')}>
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
    </div>
  )
}

export default ActionBar
