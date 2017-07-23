import { connect } from 'react-redux'

import { editRoutine, deleteRoutine, stopTracker, resetTracker } from 'duck/actions'
import RoutineForm from 'components/RoutineForm'

const mapStateToProps = (state, ownProps) => {
  const routeId = ownProps.match.params.id
  const matchedRoutine = state.routines.find(routine => routine.id === routeId)

  if (matchedRoutine)
    return { initialValues: matchedRoutine }
  else
    return { notFound: true }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSubmit: (formData) => {
    dispatch(editRoutine(formData))
    ownProps.history.push('/')
  },
  handleDelete: (routineId) => {
    dispatch(deleteRoutine(routineId))
    ownProps.history.push('/')
  },
})

const RoutineFormPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineForm)

export default RoutineFormPage
