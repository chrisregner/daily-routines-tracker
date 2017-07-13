import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import td from 'testdouble'
import { shallow } from 'enzyme'
import Chance from 'chance'
import moment from 'moment'

import { Form, Input, TimePicker, Button } from 'antd'
import RoutineForm from './RoutineForm'

chai.use(chaiEnzyme())
const rnd = new Chance()

describe('<RoutineForm />', () => {
  before(() => {
    // Temporarily silence the async-validator's logs
    td.replace(console, 'warn')
  })

  after(() => {
    td.reset()
  })

  it('should render', () => {
    const routineForm = shallow(<RoutineForm />)
    expect(routineForm).to.be.present()
  })

  /* ===============================
  =            The Form            =
  =============================== */

  // Get to the renderer's actual root component
  // by diving past the AntD's decoration layers
  const findPureForm = (wrpr) => wrpr.dive().dive()

  it('the render an AntD Form', () => {
    const routineForm = shallow(<RoutineForm />)
    expect(findPureForm(routineForm)).to.match(Form)
  })

  describe('the rendered form', () => {
    /* =======================================
    =            Routine Name Field            =
    ======================================= */

    const findRoutineNameField = wrpr => findPureForm(wrpr).find('[name="routineName"]')

    it('should render a routineName field', () => {
      const routineNameField = findRoutineNameField(shallow(<RoutineForm />))
      expect(routineNameField).to.have.lengthOf(1)
    })

    describe('the rendered routineName field', () => {
      it('should be an AntD <Input />', () => {
        const routineNameField = findRoutineNameField(shallow(<RoutineForm />))
        expect(routineNameField).to.match(Input)
      })

      it('should be of type `text`', () => {
        const routineNameField = findRoutineNameField(shallow(<RoutineForm />))
        expect(routineNameField).to.have.prop('type', 'text')
      })

      context('when field value is changed and left empty', () => {
        it('should invalidate', () => {
          const routineForm = shallow(<RoutineForm />)
          const getFieldError = () => routineForm.prop('form').getFieldError('routineName')
          const routineNameField = findRoutineNameField(routineForm)

          routineNameField.prop('onChange')({ target: { value: rnd.word() } })
          expect(getFieldError()).to.equal(undefined)
          routineNameField.prop('onChange')({ target: { value: '' } })
          expect(getFieldError()).to.have.lengthOf(1)
        })
      })

      context('when initial value is set', () => {
        it('should apply the initial value', () => {
          const initialVal = rnd.word()
          const routineNameField = findRoutineNameField(shallow(
            <RoutineForm initialValues={{ routineName: initialVal }} />
          ))
          expect(routineNameField).to.have.prop('value', initialVal)
        })

        it('should still let its value be changed', () => {
          const initialVal = rnd.word()
          const newVal = rnd.word()
          const routineForm = shallow(
            <RoutineForm initialValues={{ routineName: initialVal }} />
          )
          const getRoutineNameField = () => findRoutineNameField(routineForm)

          getRoutineNameField().prop('onChange')({ target: { value: newVal } })
          expect(getRoutineNameField()).to.have.prop('value', newVal)
        })
      })

      context('when initial value is not set', () => {
        it('should have an empty string as initial value', () => {
          const routineNameField = findRoutineNameField(shallow(<RoutineForm />))
          expect(routineNameField).to.not.have.prop('value')
        })

        it('should still let its value be changed', () => {
          const newVal = rnd.word()
          const routineForm = shallow(<RoutineForm />)
          const getRoutineNameField = () => findRoutineNameField(routineForm)

          getRoutineNameField().prop('onChange')({ target: { value: newVal } })
          expect(getRoutineNameField()).to.have.prop('value', newVal)
        })
      })
    })

    /* ======================================
    =            Duration Field            =
    ====================================== */

    const findDurationField = wrpr => findPureForm(wrpr).find('[name="duration"]')

    it('should render a duration field', () => {
      const durationField = findDurationField(shallow(<RoutineForm />))
      expect(durationField).to.have.lengthOf(1)
    })

    describe('the rendered duration field', () => {
      it('should be an AntD <TimePicker />', () => {
        const durationField = findDurationField(shallow(<RoutineForm />))
        expect(durationField).to.match(TimePicker)
      })

      it('should have a default open value of 00:00:00', () => {
        const durationField = findDurationField(shallow(<RoutineForm />))
        const expectedDefault = moment('00:00:00', 'HH:mm:ss')
        const actualDefault = durationField.prop('defaultOpenValue')
        const isDefaultCorrect = actualDefault.isSame(expectedDefault)
        expect(isDefaultCorrect).to.equal(true)
      })

      context('when field value is changed and left empty', () => {
        it('should not invalidate', () => {
          const routineForm = shallow(<RoutineForm />)
          const getFieldError = () => routineForm.prop('form').getFieldError('routineName')
          const durationField = findDurationField(routineForm)

          durationField.prop('onChange')(moment())
          expect(getFieldError()).to.equal(undefined)
          durationField.prop('onChange')(null)
          expect(getFieldError()).to.equal(undefined)
        })
      })

      context('when initial value is set', () => {
        it('should apply the initial value', () => {
          const initialVal = moment()
          const durationField = findDurationField(shallow(
            <RoutineForm initialValues={{ duration: initialVal }} />
          ))
          const isCurrentValCorrect = durationField.prop('value').isSame(initialVal)
          expect(isCurrentValCorrect).to.equal(true)
        })

        it('should still let its value be changed', () => {
          const initialVal = moment()
          const newVal = moment(initialVal)
          newVal.add(rnd.integer({ min: 1, max: 1000 }), 'seconds')
          const routineForm = shallow(<RoutineForm initialValues={{ duration: initialVal }} />)
          const getDurationField = () => findDurationField(routineForm)
          getDurationField().prop('onChange')({ target: { value: newVal } })
          const isCurrentValCorrect = getDurationField().prop('value').isSame(newVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })

      context('when initial value is not set', () => {
        it('should have no initial value', () => {
          const durationField = findDurationField(shallow(<RoutineForm />))
          expect(durationField).to.not.have.prop('value')
        })

        it('should still let its value be changed', () => {
          const newVal = moment()
          newVal.add(rnd.integer({ min: 1, max: 1000 }), 'seconds')
          const routineForm = shallow(<RoutineForm />)
          const getDurationField = () => findDurationField(routineForm)
          getDurationField().prop('onChange')({ target: { value: newVal } })
          const isCurrentValCorrect = getDurationField().prop('value').isSame(newVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })
    })

    /* ======================================
    =            Reminder Field            =
    ====================================== */

    const findReminderField = wrpr => findPureForm(wrpr).find('[name="reminder"]')

    it('should render a reminder field', () => {
      const reminderField = findReminderField(shallow(<RoutineForm />))
      expect(reminderField).to.have.lengthOf(1)
    })

    describe('the rendered reminder field', () => {
      it('should be an AntD <TimePicker />', () => {
        const reminderField = findReminderField(shallow(<RoutineForm />))
        expect(reminderField).to.match(TimePicker)
      })

      it('should have a default open value of 00:00 am', () => {
        const reminderField = findReminderField(shallow(<RoutineForm />))
        const expectedDefault = moment('00:00 am', 'HH:mm a')
        const actualDefault = reminderField.prop('defaultOpenValue')
        const isDefaultCorrect = actualDefault.isSame(expectedDefault)
        expect(isDefaultCorrect).to.equal(true)
      })

      context('when field value is changed and left empty', () => {
        it('should not invalidate', () => {
          const routineForm = shallow(<RoutineForm />)
          const getFieldError = () => routineForm.prop('form').getFieldError('routineName')
          const reminderField = findReminderField(routineForm)

          reminderField.prop('onChange')(moment())
          expect(getFieldError()).to.equal(undefined)
          reminderField.prop('onChange')(null)
          expect(getFieldError()).to.equal(undefined)
        })
      })

      context('when initial value is set', () => {
        it('should apply the initial value', () => {
          const initialVal = moment()
          const reminderField = findReminderField(shallow(
            <RoutineForm initialValues={{ reminder: initialVal }} />
          ))
          const isCurrentValCorrect = reminderField.prop('value').isSame(initialVal)
          expect(isCurrentValCorrect).to.equal(true)
        })

        it('should still let its value be changed', () => {
          const initialVal = moment()
          const newVal = moment(initialVal)
          newVal.add(rnd.integer({ min: 1, max: 1000 }), 'seconds')
          const routineForm = shallow(<RoutineForm initialValues={{ reminder: initialVal }} />)
          const getReminderField = () => findReminderField(routineForm)
          getReminderField().prop('onChange')({ target: { value: newVal } })
          const isCurrentValCorrect = getReminderField().prop('value').isSame(newVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })

      context('when initial value is not set', () => {
        it('should have no initial value', () => {
          const reminderField = findReminderField(shallow(<RoutineForm />))
          expect(reminderField).to.not.have.prop('value')
        })

        it('should still let its value be changed', () => {
          const newVal = moment()
          newVal.add(rnd.integer({ min: 1, max: 1000 }), 'seconds')
          const routineForm = shallow(<RoutineForm />)
          const getReminderField = () => findReminderField(routineForm)
          getReminderField().prop('onChange')({ target: { value: newVal } })
          const isCurrentValCorrect = getReminderField().prop('value').isSame(newVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })
    })

    /* =====================================
    =            Submit Button            =
    ===================================== */

    const findSubmitBtn = wrpr => findPureForm(wrpr).find('[name="submit"]')

    it('should render a submit button', () => {
      const submitBtn = findSubmitBtn(shallow(<RoutineForm />))
      expect(submitBtn).to.have.lengthOf(1)
    })

    describe('the rendered submit button', () => {
      it('should be an AntD <Button />', () => {
        const submitBtn = findSubmitBtn(shallow(<RoutineForm />))
        expect(submitBtn).to.match(Button)
      })

      context('when form is not touched', () => {
        context('when form is empty', () => {
          it('should be disabled', () => {
            const submitBtn = findSubmitBtn(shallow(<RoutineForm />))
            expect(submitBtn).to.have.prop('disabled', true)
          })
        })

        context('when form is valid and has initial values', () => {
          it('should be enabled', () => {
            const submitBtn = findSubmitBtn(shallow(
              <RoutineForm initialValues={{ routineName: rnd.word() }} />
            ))
            expect(submitBtn).to.have.prop('disabled', false)
          })
        })
      })

      context('when form is touched', () => {
        context('when form is valid', () => {
          it('should be enabled', () => {
            const routineForm = shallow(<RoutineForm />)
            const getSubmitBtn = () => findSubmitBtn(routineForm)

            findRoutineNameField(routineForm).prop('onChange')({ target: { value: rnd.word() } })
            expect(getSubmitBtn()).to.have.prop('disabled', false)
          })
        })

        context('when form is invalid', () => {
          it('should be disabled', () => {
            const routineForm = shallow(<RoutineForm />)
            const getSubmitBtn = () => findSubmitBtn(routineForm)

            findRoutineNameField(routineForm).prop('onChange')({ target: { value: rnd.word() } })
            findRoutineNameField(routineForm).prop('onChange')({ target: { value: '' } })
            expect(getSubmitBtn()).to.have.prop('disabled', true)
          })
        })
      })

      context('form has initial value', () => {
        it('should have \'Update Routine\' as text', () => {
          const submitBtn = findSubmitBtn(shallow(
            <RoutineForm initialValues={{ routineName: rnd.word() }} />
          ))
          expect(submitBtn).to.contain('Update Routine')
        })
      })

      context('form has no initial value', () => {
        it('should have \'Add New Routine\' as text', () => {
          const submitBtn = findSubmitBtn(shallow(<RoutineForm />))
          expect(submitBtn).to.contain('Add New Routine')
        })
      })
    })

    /* ======================================
    =            Dismiss Button            =
    ====================================== */

    const findDismissBtn = wrpr => findPureForm(wrpr).find('[name="dismiss"]')

    it('should render a dismiss button', () => {
      const dismissBtn = findDismissBtn(shallow(<RoutineForm />))
      expect(dismissBtn).to.have.lengthOf(1)
    })

    describe('the rendered dismiss button', () => {
      it('should be an AntD <Button />', () => {
        const dismissBtn = findDismissBtn(shallow(<RoutineForm />))
        expect(dismissBtn).to.match(Button)
      })

      context('when pressed', () => {
        it('should call the passed dismiss handler', () => {
          const handleDismiss = td.function()
          const dismissBtn = findDismissBtn(shallow(
            <RoutineForm handleDismiss={handleDismiss} />
          ))

          td.verify(handleDismiss(), { times: 0, ignoreExtraArgs: true })
          dismissBtn.prop('onClick')()
          td.verify(handleDismiss(), { times: 1, ignoreExtraArgs: true })
        })
      })
    })

    /* ========================================
    =            'Go Back' Button            =
    ======================================== */

    const findGoBackBtn = wrpr => findPureForm(wrpr).find('[name="goBack"]')

    it('should render a \'go back\' button', () => {
      const goBackBtn = findGoBackBtn(shallow(<RoutineForm />))
      expect(goBackBtn).to.have.lengthOf(1)
    })

    describe('the rendered \'go back\' button', () => {
      it('should be an AntD <Button />', () => {
        const goBackBtn = findGoBackBtn(shallow(<RoutineForm />))
        expect(goBackBtn).to.match(Button)
      })

      context('when pressed', () => {
        it('should call the passed \'go back\' handler', () => {
          const handleDismiss = td.function()
          const goBackBtn = findGoBackBtn(shallow(
            <RoutineForm handleDismiss={handleDismiss} />
          ))

          td.verify(handleDismiss(), { times: 0, ignoreExtraArgs: true })
          goBackBtn.prop('onClick')()
          td.verify(handleDismiss(), { times: 1, ignoreExtraArgs: true })
        })
      })
    })

    /* =====================================
    =            Delete Button            =
    ===================================== */

    describe('the delete button', () => {
      const findDeleteBtn = wrpr => findPureForm(wrpr).find('[name="delete"]')

      context('when form has no initial value', () => {
        it('should not render a delete <Button />', () => {
          const deleteBtn = findDeleteBtn(shallow(<RoutineForm />))

          expect(deleteBtn).to.have.lengthOf(0)
        })
      })

      context('when form has initial value', () => {
        it('should render a delete <Button />', () => {
          const deleteBtn = findDeleteBtn(shallow(
            <RoutineForm initialValues={{ routineName: rnd.word() }} />
          ))

          expect(deleteBtn).to.have.lengthOf(1)
        })

        describe('the rendered delete button', () => {
          it('should an Antd <Button />', () => {
            const deleteBtn = findDeleteBtn(shallow(
              <RoutineForm initialValues={{ routineName: rnd.word() }} />
            ))

            expect(deleteBtn).to.match(Button)
          })

          context('when pressed', () => {
            it('should call the passed delete handler', () => {
              const handleDelete = td.function()
              const deleteBtn = findDeleteBtn(shallow(
                <RoutineForm
                  initialValues={{ routineName: rnd.word() }}
                  handleDelete={handleDelete}
                  />
              ))

              td.verify(handleDelete(), { times: 0, ignoreExtraArgs: true })
              deleteBtn.prop('onClick')()
              td.verify(handleDelete(), { times: 1, ignoreExtraArgs: true })
            })
          })
        })
      })
    })

    /* ===================================================
    =             Other Scenarios (The Form)             =
    =================================================== */

    context('when submitted', () => {
      it('should validate the form', () => {
        const routineForm = shallow(<RoutineForm />)
        const pureRoutineForm = findPureForm(routineForm)
        const validate = td.replace(routineForm.prop('form'), 'validateFields')
        td.verify(validate(), { times: 0, ignoreExtraArgs: true })
        pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
        td.verify(validate(), { times: 1, ignoreExtraArgs: true })
      })

      context('when form is valid', () => {
        it('should call the passed onSubmit handler', () => {
          const handleSubmit = td.function()
          const routineForm = shallow(<RoutineForm handleSubmit={handleSubmit} />)
          const pureRoutineForm = findPureForm(routineForm)

          routineForm.prop('form').setFieldsValue({
            routineName: rnd.word(),
            duration: moment(String(rnd.hour({ twentyFour: true })), 'h'),
            reminder: moment(),
          })

          td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
          pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
          td.verify(handleSubmit(), { times: 1, ignoreExtraArgs: true })
        })

        it('should call the passed onSubmit handler with form values', () => {
          const handleSubmit = td.function()
          const routineForm = shallow(<RoutineForm handleSubmit={handleSubmit} />)
          const pureRoutineForm = findPureForm(routineForm)
          const formValues = {
            routineName: rnd.word(),
            duration: moment(String(rnd.hour({ twentyFour: true })), 'h'),
            reminder: moment(),
          }

          routineForm.prop('form').setFieldsValue(formValues)
          td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
          pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
          td.verify(handleSubmit(formValues), { times: 1 })
        })
      })

      context('when form is invalid', () => {
        it('should not call the passed onSubmit handler', () => {
          const handleSubmit = td.function()
          const pureRoutineForm = findPureForm(shallow(<RoutineForm handleSubmit={handleSubmit} />))
          pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
          td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
        })
      })
    })
  })
})
