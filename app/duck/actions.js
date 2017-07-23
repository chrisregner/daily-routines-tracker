import * as actionTypes from './actionTypes'
import { getRoutineById } from './selectors'

let timer

/*===================================================================
=            Actions for routines' basic CRUD operations            =
===================================================================*/

export const addRoutine = (formData) => ({
  type: actionTypes.ADD_ROUTINE,
  payload: formData,
})

export const editRoutine = (formData) => (dispatch, getState) => {
  const targetRoutine = getRoutineById(getState(), formData.id)

  if (targetRoutine.isTracking) {
    const oldDuration = targetRoutine.duration
    const newDuration = formData.duration

    if (oldDuration && newDuration) {
      const oldDurationFormatted = oldDuration.format(oldDuration.creationData().format)
      const newDurationFormatted = newDuration.format(newDuration.creationData().format)

      if (oldDurationFormatted !== newDurationFormatted)
        clearInterval(timer)
    }
  }


  dispatch({
    type: actionTypes.EDIT_ROUTINE,
    payload: formData,
  })
}

export const deleteRoutine = (routineId) => ({
  type: actionTypes.DELETE_ROUTINE,
  payload: {
    id: routineId,
  },
})


/*============================================================
=            Actions for routine tracking feature            =
============================================================*/

export const tickTracker = () => ({
  type: actionTypes.TICK_TRACKER
})

export const startTracker = (routineId) => (dispatch) => {
  clearInterval(timer)

  timer = setInterval(() => dispatch(tickTracker()), 100)

  dispatch({
    type: actionTypes.START_TRACKER,
    payload: {
      id: routineId,
    },
  })
}

export const stopTracker = () => {
  clearInterval(timer)
  return { type: actionTypes.STOP_TRACKER }
}

export const resetTracker = (routineId) => (dispatch, getState) => {
  const targetRoutine = getRoutineById(getState(), routineId)

  if (targetRoutine.isTracking)
    clearInterval(timer)


  dispatch({
    type: actionTypes.RESET_TRACKER,
    payload: {
      id: routineId
    }
  })
}
