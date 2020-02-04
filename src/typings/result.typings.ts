import { SignedGame, EnteredGame } from 'typings/user.typings';

export interface Result {
  username: string;
  enteredGame: EnteredGame;
}

export interface Signup {
  username: string;
  signedGames: ReadonlyArray<SignedGame>;
}

export interface PlayerAssignmentResult {
  results: ReadonlyArray<Result>;
  message: string;
  algorithm: string;
  status: string;
}

export interface ResultsCollectionEntry {
  startTime: string;
  results: ReadonlyArray<Result>;
  message: string;
  algorithm: string;
}

export interface AssignmentStrategyResult {
  results: ReadonlyArray<Result>;
  message: string;
}
