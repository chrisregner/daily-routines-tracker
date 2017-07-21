import { connect } from 'react-redux'

import RoutineList from 'components/RoutineList'

const mapStateToProps = state => ({
  routines: state.routines,
})

const PopulatedRoutineList = connect(mapStateToProps)(RoutineList)

export default PopulatedRoutineList
