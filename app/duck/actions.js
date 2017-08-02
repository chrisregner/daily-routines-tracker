import * as actionTypes from './actionTypes'
import { getRoutineById } from './selectors'

let timer

// convenient for clearing intervals in tests
export const getLastIntervalId = () => timer

/* ===================================================================
=            Actions for routines' basic CRUD operations            =
=================================================================== */

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

/* ============================================================
=            Actions for routine tracking feature            =
============================================================ */

export const tickTracker = () => ({
  type: actionTypes.TICK_TRACKER,
})

export const startTracker = (routineId) => (dispatch, getState) => {
  clearInterval(timer)

  timer = setInterval(() => {
    let timeLeft

    if (typeof getState === 'function')
      timeLeft = getRoutineById(getState(), routineId).timeLeft

    dispatch(tickTracker())

    if (
      timeLeft &&
      (
        timeLeft.format('HH:mm:ss.S') === '00:00:00.1' ||
        timeLeft.format('HH:mm:ss.S') === '00:00:00.0'
        )
      )
      clearInterval(timer)
  }, 100)

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
      id: routineId,
    },
  })
}

export const markDone = (routineId) => ({
  type: actionTypes.MARK_DONE,
  payload: {
    id: routineId,
  },
})

/* =================================================
=            Misc Actions for Routines            =
================================================= */

// TODO: make it clear the last interval as well
export const resetAllRoutines = () => ({
  type: actionTypes.RESET_ALL_ROUTINES,
})

export const setRoutines = (routines) => ({
  type: actionTypes.SET_ROUTINES,
  payload: {
    routines,
  },
})

export const clearNotifs = () => ({
  type: actionTypes.CLEAR_NOTIFS,
})

/* ===================================================
=            Misc Actions for Root State            =
=================================================== */

export const toggleSort = () => ({
  type: actionTypes.TOGGLE_SORT,
})
