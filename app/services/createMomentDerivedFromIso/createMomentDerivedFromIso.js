import moment from 'moment'

export default (...argsForMoment) => (
  moment(moment(...argsForMoment).toJSON())
)
