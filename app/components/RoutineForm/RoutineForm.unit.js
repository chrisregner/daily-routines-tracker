import React from 'react'
import { expect } from 'chai'
import td from 'testdouble'
import { shallow } from 'enzyme'
import moment from 'moment'
import { Link } from 'react-router-dom'

import { Form, Input, TimePicker, Button } from 'antd'
import RoutineForm from './RoutineForm'

describe('COMPONENT: RoutineForm', () => {
  before(() => {
    // Temporarily silence the async-validator's logs
    td.replace(console, 'warn')
  })

  after(() => {
    td.reset()
  })

  const getRequiredProps = (props) => Object.assign(
    {},
    {
      handleSubmit: () => {},
    },
    props,
  )

  it('should render', () => {
    const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
    expect(routineForm).to.be.present()
  })

  /* ===============================
  =            The Form            =
  =============================== */

  // Get to the renderer's actual root component
  // by diving past the AntD's decoration layers
  const diveThruAntDHOC = (wrpr) => wrpr.dive().dive()

  it('the render an AntD Form', () => {
    const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
    expect(diveThruAntDHOC(routineForm)).to.match(Form)
  })

  describe('the rendered form', () => {
    /* =======================================
    =            Routine Name Field            =
    ======================================= */

    const findRoutineNameField = wrpr => diveThruAntDHOC(wrpr).find('[name="routineName"]')

    it('should render a routineName field', () => {
      const routineNameField = findRoutineNameField(shallow(<RoutineForm {...getRequiredProps()} />))
      expect(routineNameField).to.have.lengthOf(1)
    })

    describe('the rendered routineName field', () => {
      it('should be an AntD <Input />', () => {
        const routineNameField = findRoutineNameField(shallow(<RoutineForm {...getRequiredProps()} />))
        expect(routineNameField).to.match(Input)
      })

      it('should be of type `text`', () => {
        const routineNameField = findRoutineNameField(shallow(<RoutineForm {...getRequiredProps()} />))
        expect(routineNameField).to.have.prop('type', 'text')
      })

      context('when field value is changed and left empty', () => {
        it('should invalidate', () => {
          const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
          const getFieldError = () => routineForm.prop('form').getFieldError('routineName')
          const routineNameField = findRoutineNameField(routineForm)

          routineNameField.prop('onChange')({ target: { value: 'Transient Routine Name Value' } })
          expect(getFieldError()).to.equal(undefined)
          routineNameField.prop('onChange')({ target: { value: '' } })
          expect(getFieldError()).to.have.lengthOf(1)
        })
      })

      context('when initial value is set', () => {
        it('should apply the initial value', () => {
          const initialVal = 'Initial Routine name'
          const routineNameField = findRoutineNameField(shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { routineName: initialVal } })} />
          ))
          expect(routineNameField).to.have.prop('value', initialVal)
        })

        it('should still let its value be changed', () => {
          const initialVal = 'Initial Routine Name'
          const changedVal = 'Changed Routine Name'
          const routineForm = shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { routineName: initialVal } })} />
          )
          const getRoutineNameField = () => findRoutineNameField(routineForm)

          getRoutineNameField().prop('onChange')({ target: { value: changedVal } })
          expect(getRoutineNameField()).to.have.prop('value', changedVal)
        })
      })

      context('when initial value is not set', () => {
        it('should have an empty string as initial value', () => {
          const routineNameField = findRoutineNameField(shallow(<RoutineForm {...getRequiredProps()} />))
          expect(routineNameField).to.not.have.prop('value')
        })

        it('should still let its value be changed', () => {
          const changedVal = 'Changed Routine Name'
          const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
          const getRoutineNameField = () => findRoutineNameField(routineForm)

          getRoutineNameField().prop('onChange')({ target: { value: changedVal } })
          expect(getRoutineNameField()).to.have.prop('value', changedVal)
        })
      })
    })

    /* ======================================
    =            Duration Field            =
    ====================================== */

    const findDurationField = wrpr => diveThruAntDHOC(wrpr).find('[name="duration"]')

    it('should render a duration field', () => {
      const durationField = findDurationField(shallow(<RoutineForm {...getRequiredProps()} />))
      expect(durationField).to.have.lengthOf(1)
    })

    describe('the rendered duration field', () => {
      it('should be an AntD <TimePicker />', () => {
        const durationField = findDurationField(shallow(<RoutineForm {...getRequiredProps()} />))
        expect(durationField).to.match(TimePicker)
      })

      it('should have a default open value of 00:00:00', () => {
        const durationField = findDurationField(shallow(<RoutineForm {...getRequiredProps()} />))
        const expectedDefault = moment('00:00:00', 'HH:mm:ss')
        const actualDefault = durationField.prop('defaultOpenValue')
        const isDefaultCorrect = actualDefault.isSame(expectedDefault)
        expect(isDefaultCorrect).to.equal(true)
      })

      context('when field value is changed and left empty', () => {
        it('should not invalidate', () => {
          const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
          const getFieldError = () => routineForm.prop('form').getFieldError('routineName')
          const durationField = findDurationField(routineForm)

          durationField.prop('onChange')(moment('12:30:30', 'HH:mm:ss'))
          expect(getFieldError()).to.equal(undefined)
          durationField.prop('onChange')(null)
          expect(getFieldError()).to.equal(undefined)
        })
      })

      context('when initial value is set', () => {
        it('should apply the initial value', () => {
          const initialVal = moment('12:30:30', 'HH:mm:ss')
          const durationField = findDurationField(shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { duration: initialVal } })} />
          ))
          const isCurrentValCorrect = durationField.prop('value').isSame(initialVal)
          expect(isCurrentValCorrect).to.equal(true)
        })

        it('should still let its value be changed', () => {
          const initialVal = moment('12:30:30', 'HH:mm:ss')
          const changedVal = moment('18:45:45', 'HH:mm:ss')
          const routineForm = shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { duration: initialVal } })} />
          )
          const getDurationField = () => findDurationField(routineForm)
          getDurationField().prop('onChange')({ target: { value: changedVal } })
          const isCurrentValCorrect = getDurationField().prop('value').isSame(changedVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })

      context('when initial value is not set', () => {
        it('should have no initial value', () => {
          const durationField = findDurationField(shallow(<RoutineForm {...getRequiredProps()} />))
          expect(durationField).to.not.have.prop('value')
        })

        it('should still let its value be changed', () => {
          const changedVal = moment('12:30:30', 'HH:mm:ss')
          const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
          const getDurationField = () => findDurationField(routineForm)
          getDurationField().prop('onChange')({ target: { value: changedVal } })
          const isCurrentValCorrect = getDurationField().prop('value').isSame(changedVal)
          expect(isCurrentValCorrect).to.equal(true)
        })
      })
    })

    /* =====================================
    =            Submit Button            =
    ===================================== */

    const findSubmitBtn = wrpr => diveThruAntDHOC(wrpr).find('[name="submit"]')

    it('should render a submit button', () => {
      const submitBtn = findSubmitBtn(shallow(<RoutineForm {...getRequiredProps()} />))
      expect(submitBtn).to.have.lengthOf(1)
    })

    describe('the rendered submit button', () => {
      it('should be an AntD <Button />', () => {
        const submitBtn = findSubmitBtn(shallow(<RoutineForm {...getRequiredProps()} />))
        expect(submitBtn).to.match(Button)
      })

      context('when form is not touched', () => {
        context('when form is empty', () => {
          it('should be disabled', () => {
            const submitBtn = findSubmitBtn(shallow(<RoutineForm {...getRequiredProps()} />))
            expect(submitBtn).to.have.prop('disabled', true)
          })
        })

        context('when form is valid and has initial values', () => {
          it('should be enabled', () => {
            const submitBtn = findSubmitBtn(shallow(
              <RoutineForm {...getRequiredProps({ initialValues: { routineName: 'Initial Routine Name' } })} />
            ))
            expect(submitBtn).to.have.prop('disabled', false)
          })
        })
      })

      context('when form is touched', () => {
        context('when form is valid', () => {
          it('should be enabled', () => {
            const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
            const getSubmitBtn = () => findSubmitBtn(routineForm)

            findRoutineNameField(routineForm).prop('onChange')({ target: { value: 'New Routine Name' } })
            expect(getSubmitBtn()).to.have.prop('disabled', false)
          })
        })

        context('when form is invalid', () => {
          it('should be disabled', () => {
            const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
            const getSubmitBtn = () => findSubmitBtn(routineForm)

            findRoutineNameField(routineForm).prop('onChange')({ target: { value: 'Transient Routine Name Value' } })
            findRoutineNameField(routineForm).prop('onChange')({ target: { value: '' } })
            expect(getSubmitBtn()).to.have.prop('disabled', true)
          })
        })
      })

      context('form has initial value', () => {
        it('should have \'Update Routine\' as text', () => {
          const submitBtn = findSubmitBtn(shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { routineName: 'Initial Routine Name' } })} />
          ))
          expect(submitBtn).to.contain('Update Routine')
        })
      })

      context('form has no initial value', () => {
        it('should have \'Add New Routine\' as text', () => {
          const submitBtn = findSubmitBtn(shallow(<RoutineForm {...getRequiredProps()} />))
          expect(submitBtn).to.contain('Add New Routine')
        })
      })
    })

    /* ========================================
    =            'Go Back' Link            =
    ======================================== */

    it('should render a \'go back\' Link that points to Routines List', () => {
      const wrapper = diveThruAntDHOC(shallow(<RoutineForm {...getRequiredProps()} />))
      const goBackLink = wrapper.findWhere(wrpr => wrpr.is(Link) && wrpr.prop('to') === '/')
      expect(goBackLink).to.have.lengthOf(1)
    })

    /* =====================================
    =            Delete Button            =
    ===================================== */

    describe('the delete button', () => {
      const findDeleteBtn = wrpr => diveThruAntDHOC(wrpr).find('[name="delete"]')

      context('when form has no initial value', () => {
        it('should not render a delete <Button />', () => {
          const deleteBtn = findDeleteBtn(shallow(<RoutineForm {...getRequiredProps()} />))

          expect(deleteBtn).to.have.lengthOf(0)
        })
      })

      context('when form has initial value', () => {
        it('should render a delete <Button />', () => {
          const deleteBtn = findDeleteBtn(shallow(
            <RoutineForm {...getRequiredProps({ initialValues: { routineName: 'Initial Routine Name' } })} />
          ))

          expect(deleteBtn).to.have.lengthOf(1)
        })

        describe('the rendered delete button', () => {
          it('should an Antd <Button />', () => {
            const deleteBtn = findDeleteBtn(shallow(
              <RoutineForm {...getRequiredProps({ initialValues: { routineName: 'Initial Routine Name' } })} />
            ))

            expect(deleteBtn).to.match(Button)
          })

          context('when pressed', () => {
            it('should call the passed delete handler with the passed initialValues\'s id', () => {
              const passedId = '123'
              const handleDelete = td.function()
              const deleteBtn = findDeleteBtn(shallow(
                <RoutineForm
                  {...getRequiredProps({
                    initialValues: {
                      id: passedId,
                      routineName: 'Initial Routine Name',
                    },
                    handleDelete: handleDelete,
                  })}
                />
              ))

              td.verify(handleDelete(), { times: 0, ignoreExtraArgs: true })
              deleteBtn.prop('onClick')()
              td.verify(handleDelete(passedId), { times: 1 })
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
        const routineForm = shallow(<RoutineForm {...getRequiredProps()} />)
        const pureRoutineForm = diveThruAntDHOC(routineForm)
        const validate = td.replace(routineForm.prop('form'), 'validateFields')
        td.verify(validate(), { times: 0, ignoreExtraArgs: true })
        pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
        td.verify(validate(), { times: 1, ignoreExtraArgs: true })
      })

      context('when form is valid', () => {
        context('when initialValues is provided', () => {
          it('should call the passed onSubmit handler with an object of initialValues merged with form values', () => {
            const handleSubmit = td.function()
            const routineForm = shallow(
              <RoutineForm {...getRequiredProps({
                initialValues: {
                  id: '123',
                  routineName: 'Initial Routine Name',
                  duration: moment('11:11:11', 'HH:mm:ss'),
                  isTracking: true,
                  timeLeft: moment('03:33:33', 'HH:mm:ss'),
                },
                handleSubmit,
              })} />
            )
            const pureRoutineForm = diveThruAntDHOC(routineForm)
            const formValues = {
              routineName: 'New Routine Name',
              duration: moment('22:22:22', 'HH:mm:ss'),
            }

            routineForm.prop('form').setFieldsValue(formValues)
            td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
            pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })

            const expectedArg = {
              id: '123',
              routineName: 'New Routine Name',
              duration: moment('22:22:22', 'HH:mm:ss'),
              isTracking: true,
              timeLeft: moment('03:33:33', 'HH:mm:ss'),
            }
            td.verify(handleSubmit(expectedArg), { times: 1 })
          })

          // context('when duration is changed and initialValues has timeLeft property', () => {
          //   it.skip('should call the passed onSubmit handler with true boolean as SECOND argument', () => {
          //     const isTracking = 'MyUniqueIsTrackingVal'
          //     const handleSubmit = td.function()
          //     const routineForm = shallow(
          //       <RoutineForm {...getRequiredProps({
          //         initialValues: {
          //           id: '123',
          //           name: 'Initial Routine Name',
          //           duration: moment('11:11:11', 'HH:mm:ss'),
          //           isTracking: isTracking
          //         },
          //         handleSubmit,
          //       })} />
          //     )
          //     const pureRoutineForm = diveThruAntDHOC(routineForm)
          //     const formValues = {
          //       routineName: 'Initial Routine Name',
          //       duration: moment('22:22:22', 'HH:mm:ss'),
          //     }

          //     routineForm.prop('form').setFieldsValue(formValues)
          //     td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
          //     pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })

          //     const expectedArg = true
          //     td.verify(handleSubmit(td.matchers.anything(), expectedArg), { times: 1 })
          //   })
          // })
        })

        context('when initialValues is not provided', () => {
          it('should call the passed onSubmit handler with form values', () => {
            const handleSubmit = td.function()
            const routineForm = shallow(
              <RoutineForm {...getRequiredProps({
                handleSubmit,
              })} />
            )
            const pureRoutineForm = diveThruAntDHOC(routineForm)
            const formValues = {
              routineName: 'New Routine Name',
              duration: moment('12:30:30', 'HH:mm:ss'),
            }

            routineForm.prop('form').setFieldsValue(formValues)
            td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
            pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
            td.verify(handleSubmit(formValues), { times: 1 })
          })
        })
      })

      context('when form is invalid', () => {
        it('should not call the passed onSubmit handler', () => {
          const handleSubmit = td.function()
          const pureRoutineForm = diveThruAntDHOC(shallow(
            <RoutineForm {...getRequiredProps({
              handleSubmit,
            })} />
          ))
          pureRoutineForm.prop('onSubmit')({ preventDefault: () => {} })
          td.verify(handleSubmit(), { times: 0, ignoreExtraArgs: true })
        })
      })
    })
  })

  context('when notFound prop is set to true', () => {
    it('should render the not found message', () => {
      const routineForm = diveThruAntDHOC(shallow(
        <RoutineForm {...getRequiredProps({ notFound: true })} />
      ))
      const actualText = routineForm.text()
      const doesInclude = (text) => actualText.includes(text)


      expect(
        doesInclude('404')
        || doesInclude('not found')
        || doesInclude('not exist')
        || doesInclude('doesn’t exist')
        || doesInclude('doesn&rsquo;t exist')
      )
        .to.equal(true)
    })

    it('should not render the AntD form', () => {
      const routineForm = diveThruAntDHOC(shallow(
        <RoutineForm {...getRequiredProps({ notFound: true })} />
      ))
      expect(routineForm).to.not.have.descendants(Form)
    })
  })

  context('when initialValues prop is provided', () => {
    it('should have \'Edit Task\' as header', () => {
      const expectedHeaderText = 'Edit Task'
      const routineForm = diveThruAntDHOC(shallow(
        <RoutineForm {...getRequiredProps({ initialValues: {
          id: '123',
          routineName: 'Initial Routine Name',
        } })} />
      ))

      expect(routineForm).to.contain(expectedHeaderText)
    })
  })

  context('when initialValues prop is not provided', () => {
    it('should have \'Add New Task\' as header', () => {
      const expectedHeaderText = 'Add New Task'
      const routineForm = diveThruAntDHOC(shallow(
        <RoutineForm {...getRequiredProps()} />
      ))

      expect(routineForm).to.contain(expectedHeaderText)
    })
  })
})
