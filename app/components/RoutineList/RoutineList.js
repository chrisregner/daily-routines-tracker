import React from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import without from 'lodash/without'

import RoutineItem from './subcomponents/RoutineItem'

// TODO: turn 'Add one' text into a link
const RoutineList = ({ routines }) => (<ul>
  {(routines && routines.length) ? (
    routines.map(routine => {
      return <RoutineItem key={routine.id} {...routine} />
    })
  ) : (
    'There is no routine! Add one.'
  )}
</ul>)

RoutineList.propTypes = {
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  )
}

// const RoutineList = (props) => { console.log(props); return null }

export default RoutineList
