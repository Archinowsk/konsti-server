import { SignedGame, EnteredGame } from 'typings/user.typings';

export interface Result {
  username: string;
  enteredGame: EnteredGame;
}

export interface Signup {
  username: string;
  signedGames: readonly SignedGame[];
}

export interface PlayerAssignmentResult {
  results: readonly Result[];
  message: string;
  algorithm: string;
  status: string;
}

export interface ResultsCollectionEntry {
  startTime: string;
  results: readonly Result[];
  message: string;
  algorithm: string;
}

export interface AssignmentStrategyResult {
  results: readonly Result[];
  message: string;
}
