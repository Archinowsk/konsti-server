import { Result } from 'typings/result.typings';

export interface GroupAssignResult {
  score: number;
  signupResults: ReadonlyArray<Result>;
  playerCounter: number;
  gameCounter: number;
}
