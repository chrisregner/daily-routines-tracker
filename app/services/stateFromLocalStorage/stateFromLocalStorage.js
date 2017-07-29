import deepMap from 'deep-map'
import moment from 'moment'
import { isoRegex } from 'constants/timeFormats'

let finalState
const localState = window.localStorage.getItem('state')

if (localState) {
  const parsedState = JSON.parse(localState)

  finalState = deepMap(parsedState, (val) => (
    (typeof val === 'string' && isoRegex.test(val))
    ? moment(val)
    : val
  ))
}

export default finalState
