export const getRoutineById = (state, id) => (
  state.routines.find(routine => routine.id === id)
)

export const getRoutinesThatShouldNotify = (state) => (
  state.routines.filter(routine => routine.shouldNotify)
)
