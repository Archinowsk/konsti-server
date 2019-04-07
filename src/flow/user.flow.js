// @flow
export type FavoritedGame = {
  gameId: string,
}

export type SignedGame = {
  gameId: string,
  priority: number,
  time: Date,
}

export type EnteredGame = {
  gameId: string,
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
  created: Date | null,
}

export type SignupResult = {
  username: string,
  enteredGame: { gameId: string },
  signedGames: Array<SignedGame>,
}
