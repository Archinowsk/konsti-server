// @flow
export type SignupData = {
  id: number,
  priority: number,
}

export type User = {
  username: string,
  password: string,
  userGroup: string,
  serial: string,
  playerGroup: number,
  favoritedGames: Array<SignupData>,
  signedGames: Array<SignupData>,
  enteredGames: Array<SignupData>,
  created: Date | null,
}
