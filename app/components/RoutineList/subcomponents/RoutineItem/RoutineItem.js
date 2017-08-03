import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'
import c from 'services/convertVirtualClassNames'
import { Icon } from 'antd'
import { duration as durationFormat } from 'constants/timeFormats'

let s

class RoutineItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    routineName: PropTypes.string.isRequired,
    duration: PropTypes.instanceOf(moment),
    timeLeft: PropTypes.instanceOf(moment),
    isDone: PropTypes.bool,
    isTracking: PropTypes.bool,
    isSorting: PropTypes.bool.isRequired,
    handleMarkDone: PropTypes.func.isRequired,
    handleStartTracker: PropTypes.func.isRequired,
    handleStopTracker: PropTypes.func.isRequired,
    handleResetTracker: PropTypes.func.isRequired,

    // props from React Router
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleRoutineItemInnerClick = () => {
    const { id, history, isSorting } = this.props

    if (isSorting) return

    history.push(`/routines/${id}`)
  }

  handleRoutineControls = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (this.props.isSorting) return

    const {
      handleStartTracker, handleStopTracker, handleResetTracker, handleMarkDone,
      id, isDone, isSorting
    } = this.props
    const btnClassName = e.currentTarget.className

    if (btnClassName.includes('start-tracker'))
      handleStartTracker(id)
    else if (btnClassName.includes('stop-tracker'))
      handleStopTracker()
    else if (btnClassName.includes('reset-tracker'))
      handleResetTracker(id)
    else if (btnClassName.includes('toggleIsDone'))
      if (isDone) {
        handleResetTracker(id)
      } else {
        handleMarkDone(id)
      }
  }

  render = () => {
    const {
      routineName, duration, timeLeft, isTracking, isDone,
    } = this.props
    const durationToShow = timeLeft || duration

    return (
      <s.RootDiv
        role='listitem'
        className={c(
          isDone && 'isDone green',
          isTracking && 'gold',
          (!isDone && !isTracking) && 'dark-gray',
        )}
      >
        <div
          onClick={this.handleRoutineItemInnerClick}
          className={c(
            'flex items-center h-100 f4 lh-title pointer edit-routine bg-white'
          )}
        >
          <button className={c('toggleIsDone -btn-reset')} onClick={this.handleRoutineControls}>
            {
              isDone
              ? <Icon type='check-circle' className='f3' />
              : <Icon type='check-circle-o' className='f3' />
            }
          </button>

          <div className='self-grow-1 pv1 truncate ml2'>
            {routineName}
          </div>

          {
            ((duration && (isTracking || timeLeft)) || isDone)
            && <div className='ml2'>
              <button className={c('reset-tracker -btn-reset')} onClick={this.handleRoutineControls}>
                <Icon type='reload' className='f3' />
              </button>
            </div>
          }

          {
            (durationToShow && isDone !== true)
            && (
              isTracking ? (
                <div className='ml2'>
                  <button className={c('stop-tracker -btn-reset')} onClick={this.handleRoutineControls}>
                    <Icon type='pause-circle-o' className='f3' />
                  </button>
                </div>
              ) : (
                <div className='ml2'>
                  <button className={c('start-tracker -btn-reset')} onClick={this.handleRoutineControls}>
                    <Icon type='play-circle-o' className='f3' />
                  </button>
                </div>
              )
            )
          }

          {
            (durationToShow)
            && <s.DurationDiv className='flex flex-column ml2 f6 lh-copy'>
              {
                durationToShow
                && <div className='flex items-center'>
                  <Icon type='clock-circle-o' className='self-grow-1 tl' />
                  <div className='duration'>{durationToShow.format(durationFormat)}</div>
                </div>
              }
            </s.DurationDiv>
          }
        </div>
      </s.RootDiv>
    )
  }
}

s = {
  RootDiv: styled.div`
    height: 3.5rem;
    margin-bottom: 1px;
  `,
  DurationDiv: styled.div`
    min-width: 4.5rem;
    width: 4.5rem;
  `,
}

export default withRouter(RoutineItem)
export const PureRoutineItem = RoutineItem
