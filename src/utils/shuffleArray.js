/* @flow */
export const shuffleArray = (array: $ReadOnlyArray<any>) => {
  // Don't mutate input array
  /* $FlowFixMe */
  const shuffledArray = array.slice()

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffledArray[i]
    shuffledArray[i] = shuffledArray[j]
    shuffledArray[j] = temp
  }
  return shuffledArray
}
