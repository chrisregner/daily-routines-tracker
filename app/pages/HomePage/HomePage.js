import { connect } from 'react-redux'

import { resetAllRoutines } from 'duck/actions'
import HomePagePure from './HomePagePure'

const mapDispatchToProps = dispatch => ({
  handlers: {
    handleResetAllRoutines: () => { dispatch(resetAllRoutines()) },
  }
})

const HomePage = connect(undefined, mapDispatchToProps)(HomePagePure)

export default HomePage
