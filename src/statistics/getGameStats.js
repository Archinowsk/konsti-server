/* @flow */
import fs from 'fs'
import logger from '/utils/logger'
import { getYear } from './statsUtil'

const getGameStats = () => {
  const year = getYear()

  const gameData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/games.json`, 'utf8')
  )

  logger.info(gameData.length)
  logger.info(gameData[100].title)
}

getGameStats()
