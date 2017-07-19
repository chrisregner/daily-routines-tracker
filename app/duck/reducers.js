import moment from 'moment'
import id from 'shortid'
import merge from 'lodash/merge'
import { combineReducers } from 'redux'

import * as actionTypes from './actionTypes'

const initialRoutinesState = [{
  id: id.generate(),
  routineName: 'Jog',
  duration: moment('00:15:00', 'HH:mm:ss'),
  reminder: moment('4:00 am', 'h:mm a'),
}, {
  id: id.generate(),
  routineName: 'pneumonoultramicroscopicsilicovolcanoconiosis',
  duration: moment('08:00:00', 'HH:mm:ss'),
}]



const routines = (state = initialRoutinesState, action) => {
  switch (action.type) {
    case actionTypes.ADD_ROUTINE:
      return [
        merge({ id: id.generate() }, action.payload),
        ...state,
      ]
    default:
      return state
  }
}

const dailyRoutinesTracker = combineReducers({ routines })

export default dailyRoutinesTracker
export { routines }
