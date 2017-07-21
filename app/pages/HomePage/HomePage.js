import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'

import PopulatedRoutineList from 'containers/PopulatedRoutineList'

const HomePage = () => (<div>
  <div className='flex items-center mb3 f3'>
    <h1 className='self-grow-1 ma0 f5 dark-gray normal ttu lh-title'>{'Daily Routine Tracker'}</h1>
    <div className='lh-title'>
      <Link to='routines/new'><Icon type="plus" /></Link>
    </div>
  </div>
  <PopulatedRoutineList />
</div>)

export default HomePage