import React from 'react'
import PropTypes from 'prop-types'
import MomentProp from 'react-moment-proptypes'
import moment from 'moment'

import { Form, Icon, Input, Button, TimePicker } from 'antd'

class TaskForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      taskForm: PropTypes.string,
      duration: MomentProp.momentObj,
      reminder: MomentProp.momentObj,
    }),
    handleDismiss: PropTypes.func,
    handleDelete: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  static defaultProps = {
    initialValues: {},
  }

  shouldDisableSubmit = () => {
    const { getFieldsValue, getFieldsError } = this.props.form
    const hasTruthyProp = (obj) => Object.values(obj).some(prop => !!prop)
    const hasError = hasTruthyProp(getFieldsError())
    const hasValue = hasTruthyProp(getFieldsValue())
    const isValid = hasValue && !hasError

    return !isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) this.props.handleSubmit(values)
    })
  }

  render = () => {
    const { getFieldDecorator } = this.props.form
    const initValues = this.props.initialValues
    const hasInitValues = Object.keys(initValues).length > 0

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className='mb3 cf'>
          <Button
            className='fl'
            icon='arrow-left'
            name='goBack'
            onClick={this.props.handleDismiss}
          />

          <div className='fr'>
            {
              hasInitValues &&
              <Button
                type='danger'
                icon='delete'
                name='delete'
                onClick={this.props.handleDelete}
              />
            }
            <Button
              className='ml2'
              icon='close'
              name='dismiss'
              onClick={this.props.handleDismiss}
            />
          </div>
        </div>

        <Form.Item className='mb2' label='Task' colon={false}>
          {getFieldDecorator('taskName', {
            rules: [{ required: true, message: 'Please put the task’s name!' }],
            initialValue: initValues.taskName,
          })(
            <Input
              prefix={<Icon type='pushpin-o' />}
              placeholder='Task name'
              name='taskName'
            />
          )}
        </Form.Item>
        <div className='cf'>
          <Form.Item className='fl mb2 w-50' label='Duration' colon={false}>
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
          <Form.Item className='fl mb2 w-50' label='Reminder' colon={false}>
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
        </div>
        <Form.Item className='mt4'>
          <Button
            type='primary'
            htmlType='submit'
            disabled={this.shouldDisableSubmit()}
            name='submit'
          >
            {hasInitValues ? 'Update Task' : 'Add New Task'}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const AntDFormedTaskForm = Form.create()(TaskForm)
AntDFormedTaskForm.displayName = 'Form(TaskForm)'

export default AntDFormedTaskForm
export { TaskForm as PureTaskForm }
