import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import RoutineItem from './subcomponents/RoutineItem'

// TODO: turn 'Add one' text into a link
const RoutineList = ({ routines, handleStartTracker, handleStopTracker, handleEditRoutine }) => (<ul>
  {
    (routines && routines.length)
    ? (

      routines.map(routine => (
        <RoutineItem
          key={routine.id}
          handleStartTracker={handleStartTracker}
          handleStopTracker={handleStopTracker}
          {...routine}
        />
      ))

    )
    : (

      <div className='mt6 f3 lh-copy'>
        There is no routine! <br />
        <Link to='/routines/new'>Add one.</Link>
      </div>

    )
  }
</ul>)

RoutineList.propTypes = {
  handleStartTracker: PropTypes.func.isRequired,
  handleStopTracker: PropTypes.func.isRequired,
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ).isRequired,
}

export default RoutineList
