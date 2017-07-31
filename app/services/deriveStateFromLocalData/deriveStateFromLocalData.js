import deepMap from 'deep-map'
import moment from 'moment'
import merge from 'lodash/merge'

import momentifyObject from 'services/momentifyObject'

export default (localStateJson, timeLastTrackedJson) => {
  if (localStateJson) {
    const localState = JSON.parse(localStateJson)

    // momentifiedState... cause we will convert any ISO 8601 string into moment
    const momentifiedState = momentifyObject(localState)

    return merge(
      {},
      momentifiedState,
      {
        routines: momentifiedState.routines.map((routine) => {
          // if a timer was running on close...
          if (routine.isTracking) {
            const { timeLeft: theTimeLeft, duration } = routine
            const timeLeft = (theTimeLeft || duration)

            // get the timePastInMs
            const presentTime = moment()
            const timeLastTracked = moment(timeLastTrackedJson)
            const timePastInMs = presentTime.diff(timeLastTracked)

            // get the timeLeftIfKeptTracking
            const timeLeftIfKeptTracking = timeLeft.clone().subtract(timePastInMs)

            // determine if shouldTrackerHaveFinished
            let shouldTrackerHaveFinished

            if (
              timeLeftIfKeptTracking.format('YYYY-MM-DD') !== timeLeft.format('YYYY-MM-DD')
              || (
                timeLeftIfKeptTracking.format('YYYY-MM-DD HH:mm:ss.SSS')
                === `${timeLeft.format('YYYY-MM-DD')} 00:00:00.000`
                )
              )
              shouldTrackerHaveFinished = true

            // finally, return the computed state
            if (shouldTrackerHaveFinished)
              return merge(
                routine,
                {
                  timeLeft: null,
                  isTracking: false,
                  isDone: true,
                  shouldNotify: true,
                }
              )

            return merge(
              routine,
              {
                // derive it from ISO string just like every other moment here,
                // to keep it easy to test
                timeLeft: moment(timeLeftIfKeptTracking.toJSON()),
              }
            )
          }

          return routine
        })
      },
    )
  }
}
