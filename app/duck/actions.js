import * as actionTypes from './actionTypes'

export const addRoutine = (payload) => ({
  type: actionTypes.ADD_ROUTINE,
  payload
})

export const editRoutine = (payload) => ({
  type: actionTypes.EDIT_ROUTINE,
  payload
})
