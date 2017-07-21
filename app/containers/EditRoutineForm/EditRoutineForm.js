import { connect } from 'react-redux'

import { editRoutine, addRoutine } from 'duck/actions'
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
    console.log(formData)
    dispatch(editRoutine(formData))
    ownProps.history.push('/')
  },
})

const RoutineFormPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineForm)

export default RoutineFormPage