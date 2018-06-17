/* @flow */
const { logger } = require('../utils/logger')
const groupAssignPlayers = require('./group/groupAssignPlayers')
const munkresAssignPlayers = require('./munkres/munkresAssignPlayers')

const assignPlayers = (
  players: Array<Object>,
  games: Array<Object>,
  startingTime: Date
) => {
  const strategy = 'munkres'

  logger.info(
    `Received data for ${players.length} players and ${games.length} games`
  )

  logger.info(
    `Assigning players for games starting at ${startingTime.toString()}`
  )

  logger.info(`Assign strategy: ${strategy}`)

  let result = null
  if (strategy === 'munkres') {
    result = munkresAssignPlayers(players, games, startingTime)
  } else if (strategy === 'group') {
    result = groupAssignPlayers(players, games, startingTime)
  }

  return result
}

module.exports = assignPlayers
