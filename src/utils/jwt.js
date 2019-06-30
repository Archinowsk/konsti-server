/* @flow */
import jsonwebtoken from 'jsonwebtoken'
import { config } from 'config'
import type { JWTResult } from 'flow/jwt.flow'

export const getJWT = (userGroup: string, username: string): string => {
  if (userGroup === 'admin') {
    return jsonwebtoken.sign({ username }, config.jwtSecretKeyAdmin)
  } else {
    return jsonwebtoken.sign({ username }, config.jwtSecretKey)
  }
}

export const verifyJWT = (userGroup: string, jwt: string): JWTResult => {
  if (userGroup === 'admin') {
    return jsonwebtoken.verify(jwt, config.jwtSecretKeyAdmin)
  } else {
    return jsonwebtoken.verify(jwt, config.jwtSecretKey)
  }
}
