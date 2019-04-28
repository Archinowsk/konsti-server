/* @flow */
import type { Game } from 'flow/game.flow'

type GameWithPlayerCount = {
  game: Game,
  players: number,
}

const getRemovedGame = (gamesWithTooFewPlayers: Array<GameWithPlayerCount>) => {
  // Get games with least players
  const sortedGamesWithTooFewPlayers = gamesWithTooFewPlayers.sort((a, b) => {
    const keyA = a.players
    const keyB = b.players
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })

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
