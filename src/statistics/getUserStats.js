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

  const userData = JSON.parse(
    fs.readFileSync(`src/statistics/datafiles/${year}/users.json`, 'utf8')
  )

  console.info(`Loaded ${userData.length} users`)

  getUsersWithoutSignups(userData)
  const usersWithoutGames = getUsersWithoutGames(userData)
  getUsersSignupCount(usersWithoutGames)
  getUsersWithAllGames(userData)
}

getUserStats()
