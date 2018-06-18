/* @flow */
import { logger } from '../../../utils/logger'
import db from '../../../db/mongodb'
import { getRandomInt } from './randomVariableGenerators'

const getGames = () => db.game.getGames()
const getUsers = () => db.user.getUsers()

const signup = (games, user) => {
  // let randomIndex = getRandomInt(0, users.length - 1);
  // const randomUser = users[randomIndex].username;
  // logger.info(`Signup: selected user: ${randomUser}`);
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

  logger.info(`Signup: selected games: ${randomGames.toString()}`)

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

const signupMultiple = (count, games, users) => {
  logger.info(`Signup: ${games.length} games`)
  logger.info(`Signup: ${users.length} users`)
  logger.info(`Signup: Generate signup data for ${count} users`)

  const promises = []
  for (let i = 0; i < 10; i++) {
    promises.push(signup(games, users[i]))
  }

  return Promise.all(promises)
}

const createSignupData = async (count: number) => {
  // Sign up users to games
  logger.info('Generate signup data')

  let games = []
  let users = []

  let response = null
  try {
    response = await getGames()
    games = response

    response = await getUsers()
    users = response

    await signupMultiple(count, games, users)
  } catch (error) {
    logger.error(error)
  }
}

export { createSignupData }
