import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import PopulatedRoutineList from 'containers/PopulatedRoutineList'
import ActionBarContainer from 'containers/ActionBarContainer'

class HomePage extends React.Component {
  componentDidMount = () => {
    document.title = 'Daily Routines Tracker'
  }

  render = () => (
    <div>
      <ActionBarContainer />
      <PopulatedRoutineList />
      <div className={'absolute right-1 bottom-1 pa3 bg-white-80'}>
        <Link to='/routines/new'>
          <Button type='primary' size='large' icon='plus' shape='circle' />
        </Link>
      </div>
    </div>
  )
}

export default HomePage
