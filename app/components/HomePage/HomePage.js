import React from 'react'

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
    </div>
  )
}

export default HomePage
