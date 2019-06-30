/* @flow */
import jwt from 'jsonwebtoken'
import { config } from 'config'

export const getJWT = (userGroup: string, username: string): string => {
  if (userGroup === 'admin') {
    return jwt.sign({ username }, config.jwtSecretKeyAdmin)
  } else {
    return jwt.sign({ username }, config.jwtSecretKey)
  }
}
