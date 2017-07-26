// Thanks to https://github.com/chibicode/react-functional-css-protips
import virtualClassNames from './virtualClassNames'

const convertVirtualClassNamesBasic = (classNames) => (
  classNames
  ? classNames.split(' ').map((className) => (
    // Recursively convert.
    // Also return both functional and virtual classes
    virtualClassNames[className]
    ? `${convertVirtualClassNamesBasic(virtualClassNames[className])} ${className}`
    : className
  )).join(' ')
  : ''
)

export default convertVirtualClassNamesBasic
