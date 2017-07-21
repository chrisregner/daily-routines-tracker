import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components'
import { Icon, Row, Col } from 'antd'

let StyledLi, StyledDivForTime
const RoutineItem = ({ id, routineName, duration, reminder }) => (<StyledLi className='b--my-light-gray'>
  <Link to={`/routines/${id}`} className='flex items-center db h-100 dark-gray f4 lh-title'>
    <Icon type='check-circle-o' className='mr2' />
    <div className='self-grow-1 pr2 pv1 truncate'>
      {routineName}
    </div>
    <div className='flex flex-column f6 lh-copy'>
      {
        duration &&
        <StyledDivForTime className='flex items-center'>
          <Icon type="clock-circle-o" className='self-grow-1 tl' />
          <div>{duration.format(duration.creationData().format)}</div>
        </StyledDivForTime>
      }
      {
        reminder &&
        <StyledDivForTime className='flex items-center'>
          <Icon type="bell" className='self-grow-1 tl' />
          <div>{reminder.format(reminder.creationData().format)}</div>
        </StyledDivForTime>
      }
    </div>
  </Link>
</StyledLi>)

RoutineItem.propTypes = {
  id: PropTypes.string.isRequired,
  routineName: PropTypes.string.isRequired,
  duration: PropTypes.instanceOf(moment),
  reminder: PropTypes.instanceOf(moment),
}

StyledLi = styled.li`
  height: 3.5rem;
  border-bottom-width: 1px;
  border-bottom-style: solid;

  &:last-child {
    border-bottom-width: 0 !important;
  }
`
StyledDivForTime = styled.div`
  width: 4.5rem;
`

export default RoutineItem
