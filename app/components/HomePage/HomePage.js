import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import c from 'services/convertVirtualClassNames'
import PopulatedRoutineList from 'containers/PopulatedRoutineList'
import ActionBarContainer from 'containers/ActionBarContainer'

class HomePage extends React.Component {
  componentDidMount = () => {
    document.title = 'Daily Routines Tracker'
  }

  render = () => (
    <div className='relative vh-100'>
      <ActionBarContainer />
      <PopulatedRoutineList />
      <div className={'absolute right-2 bottom-2'}>
        <Link to='/routines/new'>
          <Button type='primary' size='large' icon='plus' shape='circle' />
        </Link>
      </div>
    </div>
  )
}

export default HomePage
