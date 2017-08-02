import { expect } from 'chai'
import td from 'testdouble'

describe('convertVirtualClassNamesBasic()', () => {
  let cvcnBasic
  const virtualCns = {
    virtualCnA: 'cnA cnB',
    virtualCnB: 'cnC',
    virtualCnC: 'virtualCnA classC',
  }

  beforeEach(() => {
    td.replace('./virtualClassNames', virtualCns)

    cvcnBasic = require('./convertVirtualClassNamesBasic').default
  })

  afterEach(() => td.reset())

  it('returns empty string when called without an argument', () =>
    expect(cvcnBasic())
      .to.equal(''),
  )

  it('just returns the input if no virtual class is found', () => {
    const res = cvcnBasic('virtualCnD cnA')
    expect(res).to.equal('virtualCnD cnA')
  })

  it('converts all virtual class names that are found into actual class names', () => {
    expect(cvcnBasic('virtualCnA nonVirtualCnA'))
      .to.contain(virtualCns.virtualCnA)

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain(virtualCns.virtualCnA)

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain(virtualCns.virtualCnB)
  })

  it('retains non-virtual class names after conversion', () => {
    expect(cvcnBasic('virtualCnA nonVirtualCnA'))
      .to.contain('nonVirtualCnA')

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain('nonVirtualCnA')

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain('nonVirtualCnB')
  })

  it('retains virtual class names after conversion', () => {
    expect(cvcnBasic('virtualCnA nonVirtualCnA'))
      .to.contain('virtualCnA')

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain('virtualCnA')

    expect(cvcnBasic('virtualCnA nonVirtualCnA virtualCnB nonVirtualCnB'))
      .to.contain('virtualCnB')
  })

  it('converts virtual class names recursively', () => {
    expect(cvcnBasic('virtualCnC', virtualCns))
      .to.contain(virtualCns.virtualCnA)
  })
})
