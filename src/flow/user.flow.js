// @flow
import type { Game } from 'flow/game.flow'

export type FavoritedGame = {
  gameId: string,
}

export type SignedGame = {
  gameDetails: Game,
  priority: number,
  time: Date,
}

export type EnteredGame = {
  gameDetails: Game,
  priority: number,
  time: Date,
}

export type User = {
  username: string,
  password: string,
  userGroup: string,
  serial: string,
  playerGroup: string,
  favoritedGames: Array<FavoritedGame>,
  signedGames: Array<SignedGame>,
  enteredGames: Array<EnteredGame>,
  createdAt: Date | null,
}
