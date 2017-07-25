import { expect } from 'chai'
import moment from 'moment'

import toInitialFormat from './momentToInitialFormat'

describe('momentToInitialFormat()', () => {
  it('should format the date using its initial format', () => {
    const testWithACertainFormat = () => {
      const subj = moment('12:30:00', 'HH:mm:ss')

      const expected = '12:30:00'
      const actual = toInitialFormat(subj)

      expect(expected).to.equal(actual)
    }

    const testWithAnotherFormat = () => {
      const subj = moment('2:22 pm', 'h:mm a')

      const expected = '2:22 pm'
      const actual = toInitialFormat(subj)

      expect(expected).to.equal(actual)
    }

    testWithACertainFormat()
    testWithAnotherFormat()
  })
})