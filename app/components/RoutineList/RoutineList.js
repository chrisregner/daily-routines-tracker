import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import RoutineItem from './subcomponents/RoutineItem'

// TODO: turn 'Add one' text into a link
const RoutineList = ({ routines }) => (<ul>
  {(routines && routines.length) ? (
    routines.map(routine => {
      return <RoutineItem key={routine.id} {...routine} />
    })
  ) : (
    <div className='mt6 f3 lh-copy'>
      There is no routine! <br />
      <Link to='/routines/new'>Add one.</Link>
    </div>
  )}
</ul>)

RoutineList.propTypes = {
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ),
}

// const RoutineList = (props) => { console.log(props); return null }

export default RoutineList
