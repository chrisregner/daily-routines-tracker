import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'
import { Icon, Button } from 'antd'

let s // styled components will be defined in this variable
const requiredIfHasDuration = (type) => (props, propName, componentName) => {
  const propBeingTested = props[propName]

  if (props['duration']) {
    if (!propBeingTested) {
      return new Error(
        `Missing Prop: '${propName}' for component '${componentName}', it is required when 'duration' prop is present`
      )
    } else {
      const shouldBeArrayButNot = (type === 'array' && !Array.isArray(propBeingTested))
      const shouldBeXButNot = (
        typeof type === 'string'
        && type !== 'array'
        && typeof propBeingTested !== type
      )
      const shouldBeInstOfXButNot = (
        typeof type !== 'string'
        && !(propBeingTested instanceof Type)
      )

      if (shouldBeXButNot || shouldBeArrayButNot || shouldBeInstOfXButNot) {
        return new Error(
          `Invalid Proptype: Prop '${propName}' supplied to component '${componentName}', it should be of type/be intance of '${type}'`
        )
      }
    }
  }
}

class RoutineItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    routineName: PropTypes.string.isRequired,
    duration: PropTypes.instanceOf(moment),
    reminder: PropTypes.instanceOf(moment),
    timeLeft: PropTypes.instanceOf(moment),
    handleStartTracker: requiredIfHasDuration('function'),
    handleStopTracker: requiredIfHasDuration('function'),

    // props from React Router
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleToggleTracker = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { handleStartTracker, handleStopTracker, id } = this.props
    const btnClassName = e.currentTarget.className

    if (btnClassName.includes('start-tracker'))
      handleStartTracker(id)
    else if (btnClassName.includes('stop-tracker'))
      handleStopTracker()
  }

  render = () => {
    const {
      history, id, routineName, reminder,
      duration, timeLeft, isTracking,
    } = this.props
    const durationToShow = timeLeft || duration

    return <s.Li className='b--my-light-gray'>
      <div
        onClick={() => { history.push(`/routines/${id}`) }}
        className='flex items-center h-100 dark-gray f4 lh-title pointer edit-routine'
      >
        <Icon type='check-circle-o' className='f3' />

        <div className='self-grow-1 pv1 truncate ml2'>
          {routineName}
        </div>

        {
          durationToShow
          && isTracking ? (
            <a className='stop-tracker' onClick={this.handleToggleTracker}>
              <Icon type='pause-circle-o' className='ml2 f3' />
            </a>
          ) : (
            <a className='start-tracker' onClick={this.handleToggleTracker}>
              <Icon type='play-circle-o' className='ml2 f3' />
            </a>
          )
        }

        {
          (durationToShow || reminder) &&
            <s.Div className='flex flex-column ml2 f6 lh-copy'>
              {
                durationToShow &&
                <div className='flex items-center'>
                  <Icon type='clock-circle-o' className='self-grow-1 tl' />
                  <div className='duration'>{durationToShow.format(durationToShow.creationData().format)}</div>
                </div>
              }
              {
                reminder &&
                <div className='flex items-center'>
                  <Icon type='bell' className='self-grow-1 tl' />
                  <div>{reminder.format(reminder.creationData().format)}</div>
                </div>
              }
            </s.Div>
        }
      </div>
    </s.Li>
  }
}

s = {
  Li: styled.li`
    height: 3.5rem;
    border-bottom-width: 1px;
    border-bottom-style: solid;

    &:last-child {
      border-bottom-width: 0 !important;
    }
  `,
  Div: styled.div`
    min-width: 4.5rem;
    width: 4.5rem;
  `,
}

export default withRouter(RoutineItem)
export const PureRoutineItem = RoutineItem
