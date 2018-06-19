// @flow
export type User = {
  username: string,
  password: string,
  userGroup: string,
  serial: string,
  playerGroup: number,
  favoritedGames: [{}],
  signedGames: [{}],
  enteredGames: [{}],
  created: Date | null,
}
