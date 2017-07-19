import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'

import PopulatedRoutineList from 'containers/PopulatedRoutineList'

const Home = () => (<div>
  <div className='cf f3'>
    <div className='fl'>
      <h1 className='mh0 mt0 mb3 f3 dark-gray normal lh-title'>{'Daily Routine Tracker'}</h1>
    </div>
    <div className='fr lh-title'>
      <Link to='routines/new'><Icon type="plus" /></Link>
    </div>
  </div>
  <PopulatedRoutineList />
</div>)

export default Home