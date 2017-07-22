import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'
import { Icon, Button } from 'antd'

let s // styled components will be defined in this variable

class RoutineItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    routineName: PropTypes.string.isRequired,
    duration: PropTypes.instanceOf(moment),
    reminder: PropTypes.instanceOf(moment),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  state = {
    duration: this.props.duration,
  }

  handleStartTracker = (e) => {
    e.preventDefault()
    e.stopPropagation()

    //
  }

  render = () => {
    const { id, routineName, reminder, history } = this.props
    const { duration } = this.state

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
          duration &&
          <a className='toggle-tracker' onClick={this.handleStartTracker}>
            <Icon type='play-circle-o' className='ml2 f3' />
          </a>
        }

        {
          (duration || reminder) &&
            <s.Div className='flex flex-column ml2 f6 lh-copy'>
              {
                duration &&
                <div className='flex items-center'>
                  <Icon type='clock-circle-o' className='self-grow-1 tl' />
                  <div className='duration'>{duration.format(duration.creationData().format)}</div>
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
