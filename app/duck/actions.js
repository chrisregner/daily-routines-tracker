import * as actionTypes from './actionTypes'

/*===================================================================
=            Actions for routines' basic CRUD operations            =
===================================================================*/

export const addRoutine = (formData) => ({
  type: actionTypes.ADD_ROUTINE,
  payload: formData,
})

export const editRoutine = (formData) => ({
  type: actionTypes.EDIT_ROUTINE,
  payload: formData,
})

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

let timer
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

export const resetTracker = (routineId) => ({
  type: actionTypes.RESET_TRACKER,
  payload: {
    id: routineId
  }
})

