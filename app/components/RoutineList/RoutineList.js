import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { nonEmptyObjOfFunc } from 'services/customPropTypes'
import RoutineItem from './subcomponents/RoutineItem'

const RoutineList = ({ routines, handlers }) => (<ul>
  {
    (routines && routines.length)
    ? (

      routines.map(routine => (
        <RoutineItem
          key={routine.id}
          {...routine}
          {...handlers}
        />
      ))

    )
    : (

      <div className='pa3 mt6 f3 lh-copy'>
        There is no routine! <br />
        <Link to='/routines/new'>Add one.</Link>
      </div>

    )
  }
</ul>)

RoutineList.propTypes = {
  handlers: nonEmptyObjOfFunc,
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ).isRequired,
}

export default RoutineList
