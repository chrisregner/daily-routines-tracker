import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'
import td from 'testdouble'
import Chance from 'chance'
import merge from 'lodash/merge'

import { Slider, InputNumber } from 'antd'
import IntegerStep from './IntegerStep'

chai.use(chaiEnzyme())
const rnd = new Chance()
const rndRange = () => {
  const range = {
    max: rnd.integer({ min: -998, max: 1000 }),
  }

  /**
   * This is to make sure that the minimum is less than the maximum by at
   * least 2. The minimum difference of 2 is needed to be able to get atleast
   * 1 value inbetween the min and max.
   */
  range.min = rnd.integer({ min: -1000, max: range.max - 2 })

  return range
}

describe.skip('<IntegerStep />', () => {
  const getRequiredProps = passedProps => {
    const range = rndRange()
    const requiredProps = {
      min: range.min,
      max: range.max,
      onChange: () => {},
    }

    if (passedProps && Object.keys(passedProps).length > 0)
      return merge({}, requiredProps, passedProps)

    return requiredProps
  }

  it('should render', () => {
    const integerStep = shallow(<IntegerStep {...getRequiredProps()} />)
    expect(integerStep).to.be.present()
  })

  it('should render an AntD Slider', () => {
    const integerStep = shallow(<IntegerStep {...getRequiredProps()} />)
    expect(integerStep).to.have.exactly(1).descendants(Slider)
  })

  describe('the rendered AntD Slider', () => {
    describe('its props', () => {
      it('should have a `min` prop that matches the corresponding `min` prop', () => {
        const passedRange = rndRange()
        const slider = shallow(<IntegerStep {...getRequiredProps(passedRange)} />).find(Slider)
        expect(slider).to.have.prop('min', passedRange.min)
      })

      it('should have a `max` prop that matches the passed `max` prop', () => {
        const passedRange = rndRange()
        const slider = shallow(<IntegerStep {...getRequiredProps(passedRange)} />).find(Slider)
        expect(slider).to.have.prop('max', passedRange.max)
      })

      context('when no initial value prop is passed', () => {
        it('should have a `value` prop whose value initially matches the passed min prop', () => {
          const passedRange = rndRange()
          const slider = shallow(<IntegerStep {...getRequiredProps(passedRange)} />).find(Slider)
          expect(slider).to.have.prop('value', passedRange.min)
        })
      })

      context('when the passed initial value prop is greater than minimum prop', () => {
        it('should have a `value` prop whose value initially matches the passed initial value prop', () => {
          const passedProps = rndRange()
          passedProps.initialValue = rnd.integer({
            min: passedProps.min + 1,
            max: passedProps.max,
          })
          const slider = shallow(<IntegerStep {...getRequiredProps(passedProps)} />).find(Slider)
          expect(slider).to.have.prop('value', passedProps.initialValue)
        })
      })

      context('when the passed initial value prop is equal minimum prop', () => {
        it('should have a `value` prop whose value initially matches the passed initial value prop', () => {
          const passedProps = rndRange()
          passedProps.initialValue = passedProps.min
          const slider = shallow(<IntegerStep {...getRequiredProps(passedProps)} />).find(Slider)
          expect(slider).to.have.prop('value', passedProps.initialValue)
        })
      })

      context('when <IntegerStep /> is configured to be disabled', () => {
        it('should be disabled', () => {
          const slider = shallow(<IntegerStep {...getRequiredProps({ isDisabled: true })} />).find(Slider)
          expect(slider).to.have.prop('disabled', true)
        })
      })
    })

    context('when its value is changed', () => {
      it('should update its own value', () => {
        const passedRange = rndRange()

        // Make sure the new value is greater than the minimum,
        // which would be the default initial value
        const newVal = rnd.integer({
          min: passedRange.min + 1,
          max: passedRange.max,
        })

        const integerStep = shallow(<IntegerStep {...getRequiredProps(passedRange)} />)
        const getSlider = () => integerStep.find(Slider)


        expect(getSlider()).to.have.prop('value').to.not.equal(newVal)
        getSlider().prop('onChange')(newVal)
        expect(getSlider()).to.have.prop('value', newVal)
      })

      it('should also update the InputNumber field', () => {
        const passedRange = rndRange()

        // Make sure the new value is greater than the minimum,
        // which would be the default initial value
        const newVal = rnd.integer({
          min: passedRange.min + 1,
          max: passedRange.max,
        })

        const integerStep = shallow(<IntegerStep {...getRequiredProps(passedRange)} />)
        const slider = integerStep.find(Slider)
        const getInputNumber = () => integerStep.find(InputNumber)

        expect(getInputNumber()).to.have.prop('value').to.not.equal(newVal)
        slider.prop('onChange')(newVal)
        expect(getInputNumber()).to.have.prop('value', newVal)
      })

      it('should call the passed onChange prop with the new value', () => {
        const passedRange = rndRange()

        // Make sure the new value is greater than the minimum,
        // which would be the default initial value
        const newVal = rnd.integer({
          min: passedRange.min + 1,
          max: passedRange.max,
        })

        const onChange = td.function()
        const slider = shallow(
          <IntegerStep {...getRequiredProps({ onChange, ...passedRange })} />
        ).find(Slider)

        td.verify(onChange(), { times: 0, ignoreExtraArgs: true })
        slider.prop('onChange')(newVal)
        td.verify(onChange(newVal), { times: 1 })
      })
    })
  })

  describe.skip('the other field', () => {})
})
