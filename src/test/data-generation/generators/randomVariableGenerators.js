/* @flow */
import moment from 'moment'
import { config } from 'config'

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomStartingTime = () => {
  const { CONVENTION_START_TIME } = config
  const startingTimes = [
    moment(CONVENTION_START_TIME)
      .add(2, 'hours')
      .format(),
    moment(CONVENTION_START_TIME)
      .add(3, 'hours')
      .format(),
  ]

  const randomIndex = Math.floor(Math.random() * startingTimes.length)
  return startingTimes[randomIndex]
}

export { getRandomInt, getRandomStartingTime }
