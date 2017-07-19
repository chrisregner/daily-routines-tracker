import { connect } from 'react-redux'

import { addRoutine } from 'duck/actions'
import RoutineForm from 'components/RoutineForm'

const mapDispatchToProps = (dispatch) => {
  return {
    handleSubmit: (formData) => {
      dispatch(addRoutine(formData))
      // FIXME: it should go back to routines list after adding a routine
    }
  }
}

const AddNewRoutineForm = connect(
  undefined,
  mapDispatchToProps
)(RoutineForm)

export default AddNewRoutineForm