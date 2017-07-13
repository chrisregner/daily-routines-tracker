import React from 'react'
import PropTypes from 'prop-types'
import MomentProp from 'react-moment-proptypes'
import moment from 'moment'

import { Form, Icon, Input, Button, TimePicker } from 'antd'

class RoutineForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      routineForm: PropTypes.string,
      duration: MomentProp.momentObj,
      reminder: MomentProp.momentObj,
    }),
    handleDismiss: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,

    /* PropTypes from AntD form decorator */
    form: PropTypes.shape({
      getFieldsValue: PropTypes.func.isRequired,
      getFieldsError: PropTypes.func.isRequired,
      validateFields: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    initialValues: {},
    handleDelete: () => {},
  }

  shouldDisableSubmit = () => {
    const { getFieldsValue, getFieldsError } = this.props.form
    const hasTruthyProp = (obj) => Object.values(obj).some(prop => !!prop)
    const hasError = hasTruthyProp(getFieldsError())
    const hasValue = hasTruthyProp(getFieldsValue())
    const isInvalid = !hasValue || hasError

    return isInvalid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const {
      handleSubmit,
      form: { validateFields },
    } = this.props

    validateFields((err, values) => {
      if (!err) handleSubmit(values)
    })
  }

  renderRoutineNameField = () => {
    const {
      initialValues: initValues,
      form: { getFieldDecorator },
    } = this.props

    return <Form.Item className='ma0' label='Routine Name' colon={false}>
      {getFieldDecorator('routineName', {
        rules: [{ required: true, message: 'Please put the routine’s name!' }],
        initialValue: initValues.routineName,
      })(
        <Input
          prefix={<Icon type='pushpin-o' />}
          placeholder='Routine name'
          name='routineName'
        />
      )}
    </Form.Item>
  }

  renderDurationField = () => {
    const {
      initialValues: initValues,
      form: { getFieldDecorator },
    } = this.props

    return <Form.Item className='ma0' label='Duration' colon={false}>
      {getFieldDecorator('duration', {
        initialValue: initValues.duration,
      })(
        <TimePicker
          format='HH:mm:ss'
          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
          placeholder='hh:mm:ss'
          name='duration'
        />
      )}
    </Form.Item>
  }

  renderReminderField = () => {
    const {
      initialValues: initValues,
      form: { getFieldDecorator },
    } = this.props

    return <Form.Item className='ma0' label='Reminder' colon={false}>
      {getFieldDecorator('reminder', {
        initialValue: initValues.reminder,
      })(
        <TimePicker
          format='HH:mm a'
          defaultOpenValue={moment('00:00 am', 'HH:mm a')}
          placeholder='hh:mm a'
          name='reminder'
        />
      )}
    </Form.Item>
  }

  render = () => {
    const {
      initialValues,
      handleDismiss,
      handleDelete,
    } = this.props
    const hasInitValues = Object.keys(initialValues).length > 0

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className='mb3 cf'>
          <Button
            name='goBack'
            onClick={handleDismiss}
            className='fl'
            icon='arrow-left'
          />

          <div className='fr'>
            {
              hasInitValues &&
              <Button
                name='delete'
                onClick={handleDelete}
                type='danger'
                icon='delete'
              />
            }
            <Button
              name='dismiss'
              onClick={handleDismiss}
              className='ml2'
              icon='close'
            />
          </div>
        </div>

        <div className='mb2'>
          {this.renderRoutineNameField()}
        </div>

        <div className='cf'>
          <div className='fl mb2 w-50'>
            {this.renderDurationField()}
          </div>
          <div className='fl mb2 w-50'>
            {this.renderReminderField()}
          </div>
        </div>

        <Form.Item className='mt4'>
          <Button
            name='submit'
            disabled={this.shouldDisableSubmit()}
            htmlType='submit'
            type='primary'
          >
            {hasInitValues ? 'Update Routine' : 'Add New Routine'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const DecoratedRoutineForm = Form.create()(RoutineForm)
DecoratedRoutineForm.displayName = 'AntDForm(RoutineForm)'

export default DecoratedRoutineForm
