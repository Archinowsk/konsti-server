/* @flow */
import { logger } from '../../../utils/logger'
import db from '../../../db/mongodb'
import { getRandomInt } from './randomVariableGenerators'

const signup = (games, user) => {
  const randomGames = []
  let randomIndex

  for (let i = 0; i < 3; i += 1) {
    randomIndex = getRandomInt(0, games.length - 1)
    const randomGame = games[randomIndex].id
    if (randomGames.includes(randomGame)) {
      i -= 1
    } else {
      randomGames.push(randomGame)
    }
  }

  logger.info(
    `Signup: selected games: ${randomGames.toString()} for "${user.username}"`
  )

  const gamesWithPriorities = []

  randomGames.forEach((randomGame, index) => {
    gamesWithPriorities.push({ id: randomGame, priority: index + 1 })
  })

  return db.user.saveSignup({
    username: user.username,
    selectedGames: gamesWithPriorities,
  })

  // TODO: Different users: some sign for all three, some for one
}

const signupMultiple = (games, users, inGroup) => {
  const promises = []

  // TODO: Assign same signup data for group members
  if (inGroup) {
    for (let i = 0; i < users.length; i++) {
      promises.push(signup(games, users[i]))
    }
  } else {
    for (let i = 0; i < users.length; i++) {
      promises.push(signup(games, users[i]))
    }
  }
  return Promise.all(promises)
}

const createSignupData = async () => {
  logger.info('Generate signup data')

  let games = []
  let users = []

  try {
    games = await db.game.findGames()
    users = await db.user.findUsers()
  } catch (error) {
    logger.error(error)
  }

  logger.info(`Signup: ${games.length} games`)
  logger.info(`Signup: ${users.length} users`)
  logger.info(`Signup: Generate signup data for ${users.length} users`)

  // Group all unique group numbers
  const groupedUsers = users.reduce((acc, user) => {
    ;(acc[user['playerGroup']] = acc[user['playerGroup']] || []).push(user)
    return acc
  }, {})

  logger.info(`Grouped users: ${JSON.stringify(groupedUsers, null, 2)}`)

  // Get users who are not in a group
  const individualUsers = groupedUsers['0']
  const group2 = groupedUsers['2']
  const group3 = groupedUsers['3']

  await signupMultiple(games, individualUsers)
  await signupMultiple(games, group2, true)
  await signupMultiple(games, group3, true)
}

export { createSignupData }
