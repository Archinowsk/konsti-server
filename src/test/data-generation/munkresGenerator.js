/* @flow */
import {
  createUsers,
  createAdminUser,
  createTestUser,
} from '/test/data-generation/generators/userDataGenerators'
import { createGames } from '/test/data-generation/generators/gameDataGenerators'
import { createSignupData } from '/test/data-generation/generators/signupDataGenerators'

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
