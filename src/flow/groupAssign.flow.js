// @flow
import type { Result } from 'flow/result.flow';

export type GroupAssignResult = {|
  +score: number,
  +signupResults: $ReadOnlyArray<Result>,
  +playerCounter: number,
  +gameCounter: number,
|};
