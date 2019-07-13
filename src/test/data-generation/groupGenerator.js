/* @flow */
import faker from 'faker'
import {
  createUsers,
  createAdminUser,
  createTestUsers,
  createUsersInGroup,
} from 'test/data-generation/generators/userDataGenerators'
import { createGames } from 'test/data-generation/generators/gameDataGenerators'
import { createSignupData } from 'test/data-generation/generators/signupDataGenerators'

export const groupGenerator = async (
  newUsersCount: number,
  newGamesCount: number,
  groupSize: number,
  numberOfGroups: number
): Promise<any> => {
  await createAdminUser()
  await createTestUsers(2)
  await createUsers(newUsersCount)

  for (let i = 0; i < numberOfGroups; i++) {
    const randomGroupId = faker.random.number().toString()
    await createUsersInGroup(groupSize, randomGroupId)
  }

  await createGames(newGamesCount)
  await createSignupData('group')
}
