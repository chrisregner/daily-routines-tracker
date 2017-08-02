import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'

import { nonEmptyObjOfFunc } from 'services/customPropTypes'
import RoutineItem from './subcomponents/RoutineItem'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

class RoutineList extends React.Component {
  SortableItem = SortableElement(({ routineData }) => (
    <RoutineItem
      {...routineData}
      {...this.props.handlers}
    />
  ))

  SortableList = SortableContainer(({ routines }) => {
    return (
      <div role='list' className='mb3 mh3 bg-lighter-gray'>
        {routines.map((routineData, index) => (
          <this.SortableItem key={`item-${index}`} index={index} routineData={routineData} />
        ))}
      </div>
    )
  })

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { handlers, routines } = this.props
    const reOrderedRoutines = arrayMove(cloneDeep(routines), oldIndex, newIndex)

    handlers.handleSetRoutines(reOrderedRoutines)
  }

  render () {
    const { routines, isSorting } = this.props

    return (
      <div role='list'>
        {
          (routines && routines.length)
          ? (
            <div>
              <this.SortableList routines={routines} onSortEnd={this.handleSortEnd} useDragHandle={!isSorting} />
            </div>
          )
          : (

            <div className='pa3 mt6 f3 lh-copy'>
              There is no routine! <br />
              <Link to='/routines/new'>Add one.</Link>
            </div>

          )
        }
      </div>
    )
  }
}

RoutineList.propTypes = {
  isSorting: PropTypes.bool.isRequired,
  handlers: nonEmptyObjOfFunc,
  routines: PropTypes.arrayOf(
    PropTypes.shape(RoutineItem.propTypes)
  ).isRequired,
}

export default RoutineList
