// @flow

export type Config = {|
  +appName: string,
  +port: number,
  +debug: boolean,
  +logDir: string,
  +enableAccessLog: boolean,
  +assignmentStrategy: string,
  +db: string,
  +jwtSecretKey: string,
  +jwtSecretKeyAdmin: string,
  +allowedCorsOrigins: $ReadOnlyArray<string>,
  +dataUri: string,
  +ASSIGNMENT_ROUNDS: number,
  +bundleCompression: boolean,
  +autoUpdateGames: boolean,
  +assignmentStrategy: string,
  +gameUpdateInterval: number,
  +CONVENTION_START_TIME: string,
|}
