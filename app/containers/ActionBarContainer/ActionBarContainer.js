import { connect } from 'react-redux'

import * as actions from 'duck/actions'
import ActionBar from 'components/ActionBar'

const mapDispatchToProps = dispatch => ({
  handlers: {
    handleResetAllRoutines: () => { dispatch(actions.resetAllRoutines()) },
    handleToggleSort: () => { dispatch(actions.toggleSort()) },
  }
})

const mapStateToProps = state => ({
  isSorting: state.isSorting,
})

const ActionBarContainer = connect(mapStateToProps, mapDispatchToProps)(ActionBar)

export default ActionBarContainer
