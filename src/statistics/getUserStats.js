/* @flow */
import fs from 'fs'
import logger from '/utils/logger'
import { getYear } from './statsUtil'

const getUserStats = () => {
  const year = getYear()

  const userData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/users.json`, 'utf8')
  )

  logger.info(`Loaded ${userData.length} users`)

  const enteredGames = userData.reduce((acc, user) => {
    user.entered_games.forEach(game => {
      acc[game.id] = ++acc[game.id] || 1
    })
    return acc
  }, {})

  console.log(enteredGames['8334'])
}

getUserStats()
