import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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
  handlers: (props, propName, componentName) => {
    const handlers = props[propName]
    const errMsg = `Invalid prop supplied to RoutineList: handlers. It should be an object whose all values are functions. Instead, received: ${JSON.stringify(handlers)}`

    if (typeof handlers !== 'object')
      throw new Error(errMsg)

    const nonFuncHandler = Object.entries(handlers).find((handler) => typeof handler[1] !== 'function')

    if (nonFuncHandler)
      throw new Error(errMsg)
  },
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ).isRequired,
}

export default RoutineList
