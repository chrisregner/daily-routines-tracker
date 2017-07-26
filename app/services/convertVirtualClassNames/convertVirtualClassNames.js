import classname from 'classname'

import convertVirtualClassNamesBasic from './convertVirtualClassNamesBasic'

const convertVirtualClassNames = (...args) => (
  convertVirtualClassNamesBasic(classname(...args))
)

export default convertVirtualClassNames
