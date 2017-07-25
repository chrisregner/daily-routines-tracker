export default (theMoment) => {
  const initialFormat = theMoment.creationData().format

  return theMoment.format(initialFormat)
}
