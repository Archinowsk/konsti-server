// @flow
import type { Result } from 'flow/result.flow'

export type GroupAssignmentResult = {|
  +score: number,
  +signupResults: $ReadOnlyArray<Result>,
  +playerCounter: number,
  +gameCounter: number,
|}
