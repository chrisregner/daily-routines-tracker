import { connect } from 'react-redux'

import { startTracker, editRoutine } from 'duck/actions'
import RoutineList from 'components/RoutineList'

const mapStateToProps = state => ({
  routines: state.routines,
})

const PopulatedRoutineList = connect(mapStateToProps)(RoutineList)

export default PopulatedRoutineList
