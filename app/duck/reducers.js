import moment from 'moment'
import id from 'shortid'
import merge from 'lodash/merge'
import { combineReducers } from 'redux'

import {
  duration as durationFormat,
  durationWithMs as durationWithMsFormat,
} from 'constants/timeFormats'
import * as actionTypes from './actionTypes'

moment('00:15:00', 'HH:mm:ss')

const initialRoutinesState = [{
  id: '1',
  routineName: 'Click that --->',
  duration: moment('00:00:03', 'HH:mm:ss'),
}, {
  id: '2',
  routineName: 'Code',
  duration: moment('08:00:00', 'HH:mm:ss'),
}, {
  id: '3',
  routineName: 'Read',
}]

const routines = (state = initialRoutinesState, { type, payload }) => {
  switch (type) {
    case actionTypes.ADD_ROUTINE:
      return [
        merge({ id: id.generate() }, payload),
        ...state,
      ]

    case actionTypes.EDIT_ROUTINE:
      return state.map(routineObj => {
        if (routineObj.id === payload.id) {
          if (payload.duration && routineObj.duration) {
            const newDuration = payload.duration
            const oldDuration = routineObj.duration
            const newDurationFormatted = newDuration.format(durationFormat)
            const oldDurationFormatted = oldDuration.format(durationFormat)

            if (newDurationFormatted !== oldDurationFormatted)
              return Object.assign(
                {},
                routineObj,
                payload,
                {
                  isTracking: false,
                  timeLeft: null,
                }
              )
          }

          return Object.assign({}, routineObj, payload)
        }

        return routineObj
      })

    case actionTypes.DELETE_ROUTINE:
      return state.filter(routineObj => routineObj.id !== payload.id)

    case actionTypes.START_TRACKER:
      return state.map(routineObj => {
        if (routineObj.id === payload.id) {
          const { duration, timeLeft } = routineObj
          return Object.assign(
            {},
            routineObj,
            { isTracking: true },
            timeLeft
              ? {}
              : { timeLeft: duration.clone() }
          )
        } else if (routineObj.isTracking) {
          return Object.assign(
            {},
            routineObj,
            { isTracking: false }
          )
        } else {
          return routineObj
        }
      })

    case actionTypes.TICK_TRACKER:
      return state.map(routineObj => {
        if (routineObj.isTracking) {
          const { timeLeft, duration } = routineObj
          const timeToSubtract = timeLeft || duration

          if (
            timeLeft
            && (
              timeLeft.format('HH:mm:ss.S') === '00:00:00.1'
              || timeLeft.format('HH:mm:ss.S') === '00:00:00.0'
            )
          )
            return Object.assign(
              {},
              routineObj,
              {
                timeLeft: null,
                isTracking: false,
                isDone: true,
                shouldNotify: true,
              }
            )

          return Object.assign(
            {},
            routineObj,
            {
              timeLeft: moment(timeToSubtract).subtract('100', 'milliseconds')
            }
          )
        } else {
          return routineObj
        }
      })

    case actionTypes.STOP_TRACKER:
      return state.map(routineObj => {
        if (routineObj.isTracking)
          return Object.assign(
            {},
            routineObj,
            { isTracking: false }
          )

        return routineObj
      })

    case actionTypes.RESET_TRACKER:
      return state.map(routineObj => {
        if (routineObj.id === payload.id)
          return Object.assign(
            {},
            routineObj,
            {
              timeLeft: null,
              isTracking: false,
              isDone: false,
              shouldNotify: false,
            }
          )

        return routineObj
      })

    case actionTypes.MARK_DONE:
      return state.map(routineObj => {
        if (routineObj.id === payload.id)
          return Object.assign(
            {},
            routineObj,
            {
              timeLeft: null,
              isTracking: false,
              isDone: true,
            }
          )

        return routineObj
      })

    case actionTypes.RESET_ALL_ROUTINES:
      return state.map(routineObj => (
        Object.assign(
          {},
          routineObj,
          {
            timeLeft: null,
            isTracking: false,
            isDone: false,
            shouldNotify: false,
          }
        )
      ))

    case actionTypes.CLEAR_NOTIFS:
      return state.map(routineObj => (
        Object.assign(
          {},
          routineObj,
          {
            shouldNotify: false,
          }
        )
      ))

    case actionTypes.SET_ROUTINES:
      return payload.routines

    default:
      return state
  }
}

const isSorting = (state = false, { type, payload }) => {
  switch (type) {
    case actionTypes.TOGGLE_SORT:
      return !state

    default:
      return state
  }
}

const rootReducer = combineReducers({ routines, isSorting })


export default rootReducer
export {
  routines,
  isSorting,
}
