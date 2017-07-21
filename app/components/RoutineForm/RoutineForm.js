import React from 'react'
import PropTypes from 'prop-types'
import MomentProp from 'react-moment-proptypes'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { Form, Icon, Input, Button, TimePicker } from 'antd'

class RoutineForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      routineForm: PropTypes.string,
      duration: MomentProp.momentObj,
      reminder: MomentProp.momentObj,
    }),
    handleSubmit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    notFound: PropTypes.bool,

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
      initialValues,
    } = this.props

    validateFields((err, values) => {
      if (initialValues && initialValues.id)
        values.id = initialValues.id

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
          use12Hours
          format='h:mm a'
          defaultOpenValue={moment('00:00 am', 'h:mm a')}
          placeholder='h:mm a'
          name='reminder'
        />
      )}
    </Form.Item>
  }

  render = () => {
    const {
      initialValues,
      handleDelete,
      notFound,
    } = this.props
    const hasInitValues = Object.keys(initialValues).length > 0

    if (notFound)
      return (
        <div>
          <div className='mb6 f4 lh-title'>
            <Link to='/'><Icon type="arrow-left" /></Link>
          </div>
          <div className='f3 lh-copy'>
            Sorry, the routine you requested is not found.
          </div>
        </div>
      )
    else
      return (
        <Form onSubmit={this.handleSubmit}>
          <div className='flex items-center mb3 cf f4 lh-title'>
            <Link to='/' className='self-grow-1 dib fl'><Icon type="arrow-left" /></Link>

            {
              hasInitValues &&
              <div className='fr'>
                <Button
                  name='delete'
                  onClick={handleDelete}
                  type='danger'
                  icon='delete'
                />
              </div>
            }
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
