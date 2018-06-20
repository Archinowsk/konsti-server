/* @flow */
import {
  createUsers,
  createAdminUser,
  createTestUser,
  createUsersInGroup,
} from './generators/userDataGenerators'
import { createGames } from './generators/gameDataGenerators'
import { createSignupData } from './generators/signupDataGenerators'

const groupGenerator = async (
  newUsersCount: number,
  newGamesCount: number,
  newSignupsCount: number,
  groupSize: number,
  numberOfGroups: number
) => {
  await createAdminUser()
  await createTestUser()
  await createUsers(newUsersCount)
  await createUsersInGroup(groupSize, 2)
  await createUsersInGroup(groupSize, 3)
  await createGames(newGamesCount)
  // TODO: All group members must have same signup data
  await createSignupData(newSignupsCount)
}

export default groupGenerator
