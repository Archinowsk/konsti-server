/* @flow */
import {
  createUsers,
  createAdminUser,
  createTestUsers,
} from 'test/data-generation/generators/userDataGenerators'
import { createGames } from 'test/data-generation/generators/gameDataGenerators'
import { createSignupData } from 'test/data-generation/generators/signupDataGenerators'

export const munkresGenerator = async (
  newUsersCount: number,
  newGamesCount: number
) => {
  await createAdminUser()
  await createTestUsers(2)
  await createUsers(newUsersCount)
  await createGames(newGamesCount)
  await createSignupData('munkres')
}
