import { expect } from 'chai'
import moment from 'moment'

import createMomentDerivedFromIso from './createMomentDerivedFromIso'

describe('createMomentDerivedFromIso()', () => {
  it('should return a moment that is deep equal to a moment created from ISO 8601 string', () => {
    const momentArgs = ['12:34:56.789', 'HH:mm:ss.SSS']
    const res = createMomentDerivedFromIso(...momentArgs)
    const expectedEquivalent = moment(moment(...momentArgs).toJSON())

    expect(res).to.deep.equal(expectedEquivalent)
  })

  it('should return a moment that is deep not equal to a moment created from ISO 8601 string', () => {
    const momentArgs = ['12:34:56.789', 'HH:mm:ss.SSS']
    const res = createMomentDerivedFromIso(...momentArgs)
    const expectedNonEquivalent = moment(...momentArgs)

    expect(res).to.not.deep.equal(expectedNonEquivalent)
  })
})
