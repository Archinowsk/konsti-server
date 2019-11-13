// @flow
import type { SignedGame, EnteredGame } from 'flow/user.flow';

export type Result = {|
  +username: string,
  +enteredGame: EnteredGame,
|};

export type Signup = {|
  +username: string,
  +signedGames: $ReadOnlyArray<SignedGame>,
|};

export type PlayerAssignmentResult = {|
  +results: $ReadOnlyArray<Result>,
  +message: string,
  +algorithm: string,
  +status: string,
|};

export type ResultsCollectionEntry = {|
  +startTime: string,
  +results: $ReadOnlyArray<Result>,
  +message: string,
  +algorithm: string,
|};

export type AssignmentStrategyResult = {|
  +results: $ReadOnlyArray<Result>,
  +message: string,
|};
