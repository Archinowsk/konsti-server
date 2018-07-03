/* @flow */
import fs from 'fs'
import { logger } from '/utils/logger'

const getGameStats = () => {
  const gameData = JSON.parse(
    fs.readFileSync('src/statistics/datafiles/games.json', 'utf8')
  )

  logger.info(gameData.length)
  logger.info(gameData[100].title)
}

getGameStats()
