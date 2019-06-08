/* @flow */
import _ from 'lodash'
import type { GameWithPlayerCount } from 'flow/game.flow'

const getRemovedGame = (
  gamesWithTooFewPlayers: $ReadOnlyArray<GameWithPlayerCount>
) => {
  // Get games with least players
  const sortedGamesWithTooFewPlayers = _.sortBy(gamesWithTooFewPlayers, [
    game => game.players,
  ])

  // Find games that are tied to the lowest player count
  const tiedToLowest = []
  for (let i = 0; i < sortedGamesWithTooFewPlayers.length; i += 1) {
    if (
      sortedGamesWithTooFewPlayers[i].players ===
      sortedGamesWithTooFewPlayers[0].players
    )
      tiedToLowest.push(sortedGamesWithTooFewPlayers[i])
  }

  const randomIndex = Math.floor(Math.random() * tiedToLowest.length)
  const removedGame = tiedToLowest[randomIndex].game

  return removedGame
}

export default getRemovedGame
