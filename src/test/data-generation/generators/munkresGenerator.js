// @flow
import {
  createUsers,
  createAdminUser,
  createTestUsers,
} from 'test/data-generation/generators/createUsers'
import { createGames } from 'test/data-generation/generators/createGames'
import { createSignups } from 'test/data-generation/generators/createSignups'

export const munkresGenerator = async (
  newUsersCount: number,
  newGamesCount: number
): Promise<any> => {
  await createAdminUser()
  await createTestUsers(2)
  await createUsers(newUsersCount)
  await createGames(newGamesCount)
  await createSignups('munkres')
}
