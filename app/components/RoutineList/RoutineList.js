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

const customPropTypes = {
  nonEmptyObjOfFunc: (props, propName, componentName) => {
    const handlers = props[propName]
    const errMsg = `Invalid prop supplied to RoutineList: handlers. It should be an object whose all values are functions, and at least one value is required. Instead, received: ${handlers}`

    const isObject = typeof handlers === 'object'

    const handlerEntries = isObject && Object.entries(handlers)
    const hasAtleastOneProp = handlerEntries.length > 0

    const nonFuncHandler = handlerEntries
      && handlerEntries.find((handler) => typeof handler[1] !== 'function')
    const allValuesAreFunc = nonFuncHandler === undefined

    if (!isObject || !hasAtleastOneProp || !allValuesAreFunc)
      throw new Error(errMsg)
  }
}

RoutineList.propTypes = {
  handlers: customPropTypes.nonEmptyObjOfFunc,
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ).isRequired,
}

export default RoutineList
export { customPropTypes }
