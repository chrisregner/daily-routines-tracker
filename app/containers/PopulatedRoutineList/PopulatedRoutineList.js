import { connect } from 'react-redux'

import * as actions from 'duck/actions'
import RoutineList from 'components/RoutineList'

const mapStateToProps = state => ({
  routines: state.routines,
})

const mapDispatchToProps = dispatch => ({
  handlers: {
    handleStartTracker: (routineId) => { dispatch(actions.startTracker(routineId)) },
    handleStopTracker: () => { dispatch(actions.stopTracker()) },
    handleResetTracker: (routineId) => { dispatch(actions.resetTracker(routineId)) },
    handleMarkDone: (routineId) => { dispatch(actions.markDone(routineId)) },
    handleSetRoutines: (routines) => { dispatch(actions.setRoutines(routines)) },
  }
})

const PopulatedRoutineList = connect(mapStateToProps, mapDispatchToProps)(RoutineList)

export default PopulatedRoutineList
