import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Button, Dropdown, Menu } from 'antd'

import c from 'services/convertVirtualClassNames'
import { nonEmptyObjOfFunc } from 'services/customPropTypes'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'
import MenuIcon from 'components/MenuIcon'

class HomePage extends React.Component {
  static propTypes = {
    handlers: nonEmptyObjOfFunc,
  }

  handleControls = (e) => {
    e.preventDefault()

    const { handlers } = this.props
    const btnClassName = e.currentTarget.className

    if (btnClassName.includes('jsResetAllRoutines'))
      handlers.handleResetAllRoutines()
    else if (btnClassName.includes('jsSortRoutines'))
      this.setState({ isSorting: true })
    else if (btnClassName.includes('jsFinishSortingRoutines'))
      this.setState({ isSorting: false })
  }

  state = {
    isSorting: false
  }

  getMenu = (
    <Menu selectable={false}>
      <Menu.Item>
        <Link to='/routines/new'>
          Add new routine
        </Link>
      </Menu.Item>
      <Menu.Item>
        <button className={c('jsResetAllRoutines -btn-reset')} onClick={this.handleControls}>
          Reset all routines
        </button>
      </Menu.Item>
      <Menu.Item>
        <button className={c('jsSortRoutines -btn-reset')} onClick={this.handleControls}>
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
  )

  render = () => {
    const { isSorting } = this.state

    return (
      <div className='relative vh-100'>
        <div className='flex items-center pa3 f3'>
          <h1 className='self-grow-1 ma0 f5 dark-gray normal ttu lh-title'>
            {
              isSorting
              ? (<strong>Sort Routines</strong>)
              : 'Daily Routines Tracker'
            }
          </h1>
          <div>
            {
              isSorting
              ? (
                <button className={c('jsFinishSortingRoutines -btn-reset db f6 ttu')} onClick={this.handleControls}>
                  Finish Sorting
                </button>
              )
              : (
                <Dropdown
                  className='jsActionOverflow'
                  overlay={this.getMenu}
                  placement='bottomRight'
                  trigger={['click']}
                >
                  <div>
                    <MenuIcon />
                  </div>
                </Dropdown>
              )
            }
          </div>
        </div>
        <PopulatedRoutineList isSorting={this.state.isSorting} />
        <div className={'absolute right-2 bottom-2'}>
          <Link to='/routines/new'>
            <Button type='primary' size='large' icon='plus' shape='circle' />
          </Link>
        </div>
      </div>
    )
  }
}

export default HomePage
