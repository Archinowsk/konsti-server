/* @flow */
const createUsers = require('./generators/userDataGenerators').createUsers
const createAdminUser = require('./generators/userDataGenerators')
  .createAdminUser
const createTestUser = require('./generators/userDataGenerators').createTestUser
const createGames = require('./generators/gameDataGenerators').createGames
const createSignupData = require('./generators/signupDataGenerators')
  .createSignupData

const munkresGenerator = async (
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

module.exports = munkresGenerator
