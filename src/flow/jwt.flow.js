// @flow

export type JWTResult = {
  username: string,
  iat: number,
};

export type JWTError = {
  status: string,
  message: string,
};
