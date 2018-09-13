// @flow
export type SignupData = {
  id: string,
  priority: number,
}

export type User = {
  username: string,
  password: string,
  userGroup: string,
  serial: string,
  playerGroup: string,
  favoritedGames: Array<SignupData>,
  signedGames: Array<SignupData>,
  enteredGames: Array<SignupData>,
  created: Date | null,
}
