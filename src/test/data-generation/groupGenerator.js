/* @flow */
import {
  createUsers,
  createAdminUser,
  createTestUser,
} from './generators/userDataGenerators'
import { createGames } from './generators/gameDataGenerators'
import { createSignupData } from './generators/signupDataGenerators'

const groupGenerator = async (
  newUsersCount: number,
  newGamesCount: number,
  newSignupsCount: number
) => {
  await createAdminUser()
  await createTestUser()
  await createUsers(newUsersCount)
  await createGames(newGamesCount)
  await createSignupData(newSignupsCount)
}

export default groupGenerator
