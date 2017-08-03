export const nonEmptyObjOfFunc = (props, propName, componentName) => {
  const handlers = props[propName]
  const errMsg = `Invalid prop supplied to RoutineList: handlers. It should be an object whose all values are functions, and at least one value is required. Instead, received: ${handlers}`

  const isObject = typeof handlers === 'object'

  const handlerEntries = isObject && Object.entries(handlers)
  const hasAtleastOneProp = handlerEntries.length > 0

  const nonFuncHandler = handlerEntries
    && handlerEntries.find((handler) => typeof handler[1] !== 'function')
  const allValuesAreFunc = nonFuncHandler === undefined

  if (!isObject || !hasAtleastOneProp || !allValuesAreFunc)
    throw new Error(errMsg)
}
