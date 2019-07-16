// @flow
import type { SignedGame, EnteredGame } from 'flow/user.flow'

export type Result = {|
  +username: string,
  +enteredGame: EnteredGame,
|}

export type Signup = {|
  +username: string,
  +signedGames: $ReadOnlyArray<SignedGame>,
|}

export type AssignResult = {|
  +results: $ReadOnlyArray<Result>,
  +message: string,
  +newSignupData: $ReadOnlyArray<Signup>,
|}

export type ResultsWithMessage = {|
  +results: $ReadOnlyArray<Result>,
  +message: string,
|}

export type GroupAssignmentResult = {|
  +score: number,
  +signupResults: $ReadOnlyArray<Result>,
  +playerCounter: number,
  +gameCounter: number,
|}
