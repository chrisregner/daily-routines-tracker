import { connect } from 'react-redux'

import { addRoutine } from 'duck/actions'
import RoutineForm from 'components/RoutineForm'

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSubmit: (formData) => {
    dispatch(addRoutine(formData))
    ownProps.history.push('/')
  },
})

const RoutineFormPage = connect(
  undefined,
  mapDispatchToProps
)(RoutineForm)

export default RoutineFormPage
