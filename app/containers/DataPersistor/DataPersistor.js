import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import { startTracker } from 'duck/actions'

class DataPersistor extends React.Component {
  static propTypes = {
    state: PropTypes.shape({
      routines: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          isTracking: PropTypes.bool,
        })
      ).isRequired
    }).isRequired,
    handleStartTracker: PropTypes.func.isRequired,
  }

  handleTabClose = (ev) => {
    ev.preventDefault()

    const serializedState = JSON.stringify(this.props.state)
    const serializedTimeOnLastClose = moment().toJSON()

    window.localStorage.setItem('state', serializedState)
    window.localStorage.setItem('timeLastOpen', serializedTimeOnLastClose)
  }

  componentDidMount = (e) => {
    window.addEventListener('beforeunload', this.handleTabClose)

    const { state, handleStartTracker } = this.props

    const trackingRoutine = state.routines
      .find(routine => routine.isTracking)

    if (trackingRoutine)
      handleStartTracker(trackingRoutine.id)
  }

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.handleTabClose)
  }

  render = () => null
}

const mapStateToProps = (state) => ({
  state: state
})

const mapDispatchToProps = (dispatch) => ({
  handleStartTracker: (routineId) => { dispatch(startTracker(routineId)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DataPersistor)
export { DataPersistor as PureDataPersistor }
