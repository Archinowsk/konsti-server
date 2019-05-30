// @flow
import type { Game } from 'flow/game.flow'
import type { SignedGame } from 'flow/user.flow'

export type Result = {
  username: string,
  enteredGame: Game,
  signedGames: Array<SignedGame>,
}

export type NewSignupData = { username: string, signedGames: Array<SignedGame> }

export type AssignResult = {
  results: Array<Result>,
  message: string,
  newSignupData: Array<NewSignupData>,
}

export type Signup = {
  username: string,
  signedGames: Array<SignedGame>,
}
