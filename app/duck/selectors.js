export const getRoutineById = (state, id) => (
  state.routines.find(routine => routine.id === id)
)
