import moment from 'moment'
import deepMap from 'deep-map'
import { isoRegex } from 'constants/timeFormats'

export default (obj) => (
  deepMap(obj, (val) => (
    (typeof val === 'string' && isoRegex.test(val))
    ? moment(val)
    : val
  ))
)
