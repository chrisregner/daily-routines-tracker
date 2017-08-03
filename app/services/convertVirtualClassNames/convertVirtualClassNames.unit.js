import { expect } from 'chai'
import td from 'testdouble'

describe('convertVirtualClassNames()', () => {
  let cvcn

  beforeEach(() => {
    cvcn = require('./convertVirtualClassNames')
  })

  afterEach(() => { td.reset() })

  it(
    'should return the result of convertVirtualClassNamesBasic()'
    + 'when called with the result of classname()'
    + 'when called with the passed arguments',
    () => {
      const classnameArgs = ['classnameArg1', 'classnameArg2']
      const classnameRes = 'classnameRes'
      const classname = td.function()
      td.replace('classname', classname)
      td.when(classname(...classnameArgs)).thenReturn(classnameRes)

      const cvcnBasicRes = 'cvcnBasicRes'
      const cvcnBasic = td.function()
      td.replace('./convertVirtualClassNamesBasic', cvcnBasic)
      td.when(cvcnBasic(classnameRes)).thenReturn(cvcnBasicRes)

      cvcn = require('./convertVirtualClassNames').default

      const expected = cvcnBasicRes
      const actual = cvcn(...classnameArgs)

      expect(actual).to.equal(expected)
    }
  )
})
