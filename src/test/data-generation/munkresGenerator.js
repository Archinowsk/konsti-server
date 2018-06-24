/* @flow */
import {
  createUsers,
  createAdminUser,
  createTestUser,
} from './generators/userDataGenerators'
import { createGames } from './generators/gameDataGenerators'
import { createSignupData } from './generators/signupDataGenerators'

const munkresGenerator = async (
  newUsersCount: number,
  newGamesCount: number
) => {
  await createAdminUser()
  await createTestUser()
  await createUsers(newUsersCount)
  await createGames(newGamesCount)
  await createSignupData('munkres')
}

export default munkresGenerator
