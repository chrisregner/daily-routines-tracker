import * as actionTypes from './actionTypes'

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

export const startTracker = (routineId) => ({
  type: actionTypes.START_TRACKER,
  payload: {
    id: routineId,
  },
})

// let timer = null

// const start = () => (dispatch) => {
//   clearInterval(timer)
//   dispatch({ type: TIMER_START })
//   dispatch(tick())
//   timer = setInterval(() => dispatch(tick()), 1000)
// }

// const tick = () => { type: TIMER_TICK }

// const stop = () => {
//   clearInterval(timer)
//   return { type: TIMER_STOP }
// }
