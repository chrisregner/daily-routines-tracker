import { connect } from 'react-redux'
import Joi from 'joi-browser'
import moment from 'moment'

import * as actions from 'duck/actions'
import ActionBar from 'components/ActionBar'
import momentifyObject from 'services/momentifyObject'

const mapDispatchToProps = dispatch => ({
  handlers: {
    handleResetAllRoutines: () => { dispatch(actions.resetAllRoutines()) },
    handleToggleSort: () => { dispatch(actions.toggleSort()) },
    handleImportData: (dataInJson) => {
      const dataParsed = JSON.parse(dataInJson)
      const dataMomentified = momentifyObject(dataParsed)

      const objWithRoutinesSchema = Joi.object().keys({
        routines: Joi.array().items(
          Joi.object().keys({
            id: Joi.string().required(),
            routineName: Joi.string().required(),
            isTracking: Joi.boolean(),
            isDone: Joi.boolean(),
            shouldNotify: Joi.boolean(),
            duration: Joi.alternatives().try(Joi.any().allow(null), Joi.object().type(moment)),
            timeLeft: Joi.alternatives().try(Joi.any().allow(null), Joi.object().type(moment)),
          }).required()
        )
      })

      objWithRoutinesSchema.validate(dataMomentified, (err, value) => {
        if (err)
          throw err
        else
          dispatch(actions.setRoutines(value))
      })

    },
  }
})

const mapStateToProps = state => ({
  stateInJson: JSON.stringify(state.routines),
  isSorting: state.isSorting,
})

const ActionBarContainer = connect(mapStateToProps, mapDispatchToProps)(ActionBar)

export default ActionBarContainer
