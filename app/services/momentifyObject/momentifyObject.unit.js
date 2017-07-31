import { expect } from 'chai'
import moment from 'moment'

import momentifyObject from './momentifyObject'
import createMomentDerivedFromIso from 'services/createMomentDerivedFromIso'

describe('momentifyObject()', () => {
  it('should return an object whose all ISO 8601 string values are converted to moment', () => {
    const arg = {
      string: 'string',
      num: 123,
      bool: false,
      etc: null,
      obj: {
        isoStr: moment('2017-06-15 12:34:56.789', 'YYYY-MM-DD HH:mm:ss.SSS').toJSON(),
        arrWithIsoStr: [moment().toJSON()]
      }
    }

    const actual = momentifyObject(arg)
    const expected = {
      string: 'string',
      num: 123,
      bool: false,
      etc: null,
      obj: {
        isoStr: createMomentDerivedFromIso('2017-06-15 12:34:56.789', 'YYYY-MM-DD HH:mm:ss.SSS'),
        arrWithIsoStr: [createMomentDerivedFromIso()]
      }
    }

    expect(actual).to.deep.equal(expected)
  })
})