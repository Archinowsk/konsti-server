// @flow
import type { SignedGame, EnteredGame } from 'flow/user.flow'

export type Result = {
  username: string,
  enteredGame: EnteredGame,
  signedGames: Array<SignedGame>,
}

export type Signup = {
  username: string,
  signedGames: Array<SignedGame>,
}

export type AssignResult = {
  results: Array<Result>,
  message: string,
  newSignupData: Array<Signup>,
}
