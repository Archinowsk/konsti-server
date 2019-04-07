// @flow
export type FavoritedGame = {
  id: string,
}

export type SignedGame = {
  id: string,
  priority: number,
  time: Date,
}

export type EnteredGame = {
  id: string,
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
  enteredGame: { id: string },
  signedGames: Array<SignedGame>,
}
