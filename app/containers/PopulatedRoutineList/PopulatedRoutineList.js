import { connect } from 'react-redux'

import { startTracker, stopTracker, resetTracker, markDone } from 'duck/actions'
import RoutineList from 'components/RoutineList'

const mapStateToProps = state => ({
  routines: state.routines,
})

const mapDispatchToProps = dispatch => ({
  handlers: {
    handleStartTracker: (routineId) => { dispatch(startTracker(routineId)) },
    handleStopTracker: () => { dispatch(stopTracker()) },
    handleResetTracker: (routineId) => { dispatch(resetTracker(routineId)) },
    handleMarkDone: (routineId) => { dispatch(markDone(routineId)) },
  }
})

const PopulatedRoutineList = connect(mapStateToProps, mapDispatchToProps)(RoutineList)

export default PopulatedRoutineList
