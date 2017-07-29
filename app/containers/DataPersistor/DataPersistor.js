import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class DataPersistor extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired
  }

  handleTabClose = (ev) => {
    ev.preventDefault()

    const serializedState = JSON.stringify(this.props.state)
    window.localStorage.setItem('state', serializedState)
    window.localStorage.setItem('timeClosed', new Date())
  }

  componentDidMount = (e) => {
    window.addEventListener('beforeunload', this.handleTabClose)
  }

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.handleTabClose)
  }

  render = () => null
}

const mapStateToProps = (state) => ({
  state: state
})

export default connect(mapStateToProps)(DataPersistor)
export { DataPersistor as PureDataPersistor }
