export interface JWTResult {
  username: string;
  iat: number;
}

export interface JWTError {
  status: string;
  message: string;
}
