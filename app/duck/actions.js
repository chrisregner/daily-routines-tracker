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
