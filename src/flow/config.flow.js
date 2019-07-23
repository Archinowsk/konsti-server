// @flow

export type AssignmentStrategy = 'munkres' | 'group' | 'opa' | 'group+opa'
export type GameUpdateMethod = 'signups' | 'assign'

export type Config = {|
  +appName: string,
  +port: number,
  +debug: boolean,
  +logDir: string,
  +enableAccessLog: boolean,
  +assignmentStrategy: AssignmentStrategy,
  +dbConnString: string,
  +dbName: string,
  +jwtSecretKey: string,
  +jwtSecretKeyAdmin: string,
  +allowedCorsOrigins: $ReadOnlyArray<string>,
  +dataUri: string,
  +GROUP_ASSIGNMENT_ROUNDS: number,
  +OPA_ASSIGNMENT_ROUNDS: number,
  +bundleCompression: boolean,
  +autoUpdateGamesEnabled: boolean,
  +gameUpdateInterval: number,
  +CONVENTION_START_TIME: string,
  +removeOverlapSignups: boolean,
  +generateSignups: boolean,
  +saveTestAssign: boolean,
  +autoUpdateGamePopularityEnabled: boolean,
  +gamePopularityUpdateMethod: GameUpdateMethod,
|}
