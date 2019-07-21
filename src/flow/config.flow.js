// @flow

export type AssignmentStrategy = 'munkres' | 'group' | 'opa'

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
|}
