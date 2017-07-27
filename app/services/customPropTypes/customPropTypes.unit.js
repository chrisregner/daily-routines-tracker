import { expect } from 'chai'
import * as customPropTypes from './customPropTypes'

describe('customPropTypes', () => {
  describe('nonEmptyObjOfFunc()', () => {
    it('should throw when prop is not a non-empty object whose all values are functions', () => {
      const testWith = (prop) => {
        const callWithPassedProp = () => {
          customPropTypes.nonEmptyObjOfFunc({ '1': prop }, '1', 'fakeComponentName')
        }

        expect(callWithPassedProp).to.throw()
      }

      testWith([123])
      testWith('123')
      testWith(123)
      testWith({})
      testWith({
        array: [123],
        string: 'string',
        number: 123,
        obj: {},
        func: () => {},
      })
    })

    it('should not throw when prop is an object whose all values are functions', () => {
      const callWithNonEmptyObjOfFunc = () => {
        const nonEmptyObjOfFunc = {
          funcOnly1: () => {},
          funcOnly2: () => {},
          funcOnly3: () => {},
        }

        customPropTypes.nonEmptyObjOfFunc({ '1': nonEmptyObjOfFunc }, '1', 'fakeComponentName')
      }

      expect(callWithNonEmptyObjOfFunc).to.not.throw()
    })
  })
})
