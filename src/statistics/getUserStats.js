/* @flow */
import fs from 'fs'
import { getYear } from './statsUtil'
import {
  getUsersWithoutGames,
  getUsersWithoutSignups,
  getUsersSignupCount,
  getUsersWithAllGames,
} from './statistics-helpers/userDataHelpers'

const getUserStats = () => {
  const year = getYear()

  const users = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/users.json`, 'utf8')
  )

  console.info(`Loaded ${users.length} users`)

  getUsersWithoutSignups(users)
  const usersWithoutGames = getUsersWithoutGames(users)
  getUsersSignupCount(usersWithoutGames)
  getUsersWithAllGames(users)
}

getUserStats()
