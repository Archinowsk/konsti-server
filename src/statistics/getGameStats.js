import fs from 'fs'
import { getYear } from './statsUtil'
import {
  getGamesByStartingTime,
  getUsersByGames,
  getNumberOfFullGames,
} from './statistics-helpers/gameDataHelpers'

const getGameStats = () => {
  const year = getYear()

  const games = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/games.json`, 'utf8')
  )
  console.info(`Loaded ${games.length} games`)

  const users = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/users.json`, 'utf8')
  )
  console.info(`Loaded ${games.length} users`)

  getGamesByStartingTime(games)

  const usersByGames = getUsersByGames(users)

  getNumberOfFullGames(games, usersByGames)
}

getGameStats()
