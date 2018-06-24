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
  groupSize: number,
  numberOfGroups: number
) => {
  await createAdminUser()
  await createTestUser()
  await createUsers(newUsersCount)

  for (let i = 0; i < numberOfGroups; i++) {
    await createUsersInGroup(groupSize, i + 1)
  }

  await createGames(newGamesCount)
  await createSignupData('group')
}

export default groupGenerator
