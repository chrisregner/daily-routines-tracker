import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Howl } from 'howler'
import { Modal } from 'antd'

import { clearNotifs } from 'duck/actions'
import { getRoutinesThatShouldNotify } from 'duck/selectors'

class PureDoneRoutinesNotifier extends React.Component {
  state = {
    notifSound: null,
    isPlaying: false,
  }

  static propTypes = {
    RoutinesThatShouldNotify: PropTypes.arrayOf(
      PropTypes.shape({
        routineName: PropTypes.string.isRequired
      })
    ),
    handleClearNotifs: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    const notifSound = new Howl({
      src: ['/assets/notif.ogg', '/assets/notif.mp3'],
      loop: true,
    })

    notifSound.once('load', () => {
      this.setState({ notifSound })
    })
  }

  componentDidUpdate = () => {
    const { notifSound, isPlaying } = this.state
    const { RoutinesThatShouldNotify, handleClearNotifs } = this.props

    if (notifSound) {
      if (RoutinesThatShouldNotify && RoutinesThatShouldNotify.length > 0) {
        const routineName = RoutinesThatShouldNotify[0].routineName

        if (!isPlaying) {
          notifSound.play()
          this.setState({ isPlaying: true })

          this.origDocTitle = document.title
          const title1 = 'Routine Completed:'
          const title2 = `“${routineName}”`

          document.title = title1
          this.docTitleInterval = setInterval(() => {
            console.log('DocTitleInterval!')

            if (document.title === title1)
              document.title = title2
            else
              document.title = title1
          }, 2500)

          Modal.success({
            title: (
              <div>
                You completed a routine: <br />
                {routineName}
              </div>
            ),
            okText: 'Dismiss',
            onOk: this.handleModalDismiss
          })
        }
      } else if (isPlaying) {
        this.setState({ isPlaying: false })
        notifSound.stop()
      }
    }
  }

  handleModalDismiss = () => {
    this.props.handleClearNotifs()
    document.title = this.origDocTitle
    clearInterval(this.docTitleInterval)
  }

  render = () => (null)
}

const mapStateToProps = (state) => ({
  RoutinesThatShouldNotify: getRoutinesThatShouldNotify(state),
})

const mapDispatchToProps = (dispatch) => ({
  handleClearNotifs: () => { dispatch(clearNotifs()) },
})

export default connect(mapStateToProps, mapDispatchToProps)(PureDoneRoutinesNotifier)
export { PureDoneRoutinesNotifier }
