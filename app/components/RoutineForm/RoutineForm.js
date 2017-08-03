import React from 'react'
import PropTypes from 'prop-types'
import MomentProp from 'react-moment-proptypes'
import moment from 'moment'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Icon, Input, Button, TimePicker } from 'antd'

import { duration as durationFormat } from 'constants/timeFormats'

const s = {
  CenteredH2: styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
}

class RoutineForm extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      routineForm: PropTypes.string,
      duration: MomentProp.momentObj,
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
  }

  componentDidMount = () => {
    const hasInitValues = Object.keys(this.props.initialValues).length > 0

    if (hasInitValues)
      document.title = 'Edit Routine'
    else
      document.title = 'Add New Routine'
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

    validateFields((err, formValues) => {
      if (!err) {
        const valuesToPass = Object.assign(
          {},
          initialValues,
          formValues,
        )

        handleSubmit(valuesToPass)
      }
    })
  }

  handleDelete = () => {
    const {
      handleDelete,
      initialValues,
    } = this.props

    if (handleDelete && typeof handleDelete === 'function')
      handleDelete(initialValues.id)
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
          format={durationFormat}
          defaultOpenValue={moment('00:00:00', durationFormat)}
          placeholder='hh:mm:ss'
          name='duration'
        />
      )}
    </Form.Item>
  }

  render = () => {
    const {
      initialValues,
      notFound,
    } = this.props
    const hasInitValues = Object.keys(initialValues).length > 0

    return (notFound) ? (
      <div className='pa3'>
        <div className='pb3 f4 lh-title'>
          <Link to='/'><Icon type='arrow-left' /></Link>
        </div>
        <div className='mt6 f3 lh-copy'>
            Sorry, the routine you requested doesn’t exist. <br />
          <Link to='/'>Go to home page</Link>
        </div>
      </div>
      ) : (
        <Form className='pa3' onSubmit={this.handleSubmit}>
          <div className='relative flex items-center mb3 cf f4 lh-title'>
            <Link to='/' className='self-grow-1 dib fl'><Icon type='arrow-left' /></Link>
            <s.CenteredH2 className='ma0 f5 b ttu lh-title'>
              {hasInitValues ? 'Edit Task' : 'Add New Task'}
            </s.CenteredH2>
            {
              hasInitValues
              && <div className='fr'>
                <Button
                  name='delete'
                  onClick={this.handleDelete}
                  type='danger'
                  icon='delete'
                />
              </div>
            }
          </div>

          <div className='mb2'>
            {this.renderRoutineNameField()}
          </div>

          <div className='mb2'>
            {this.renderDurationField()}
          </div>

          <Form.Item className='fr mt4'>
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
