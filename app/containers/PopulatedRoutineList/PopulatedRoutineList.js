import { connect } from 'react-redux'

import { startTracker, stopTracker } from 'duck/actions'
import RoutineList from 'components/RoutineList'

const mapStateToProps = state => ({
  routines: state.routines,
})

const mapDispatchToProps = dispatch => ({
  handleStartTracker: (routineId) => { dispatch(startTracker(routineId)) },
  handleStopTracker: () => { dispatch(stopTracker()) }
})

const PopulatedRoutineList = connect(mapStateToProps, mapDispatchToProps)(RoutineList)

export default PopulatedRoutineList
