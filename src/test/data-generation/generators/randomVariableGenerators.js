/* @flow */
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomStartingTime = () => {
  const startingTimes = [
    // '2018-07-27T14:00:00Z',
    '2018-07-27T15:00:00.000Z',
    '2018-07-27T16:00:00.000Z',
    // '2018-07-27T17:00:00Z',
    // '2018-07-27T18:00:00Z',
  ]
  const randomIndex = Math.floor(Math.random() * startingTimes.length)
  return startingTimes[randomIndex]
}

export { getRandomInt, getRandomStartingTime }
