/* @flow */
import jsonwebtoken from 'jsonwebtoken'
import { config } from 'config'
import type { JWTResult, JWTError } from 'flow/jwt.flow'

export const getJWT = (userGroup: string, username: string): string => {
  const options = {
    // expiresIn: '5 seconds',
  }

  if (userGroup === 'admin') {
    return jsonwebtoken.sign({ username }, config.jwtSecretKeyAdmin, options)
  } else if (userGroup === 'user') {
    return jsonwebtoken.sign({ username }, config.jwtSecretKey, options)
  }

  return ''
}

export const verifyJWT = (
  userGroup: string,
  jwt: string
): JWTResult | JWTError => {
  if (userGroup === 'admin') {
    try {
      return jsonwebtoken.verify(jwt, config.jwtSecretKeyAdmin)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { status: 'error', message: 'expired jwt' }
      }
    }
  } else if (userGroup === 'user') {
    try {
      return jsonwebtoken.verify(jwt, config.jwtSecretKey)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { status: 'error', message: 'expired jwt' }
      }
    }
  }

  return { status: 'error', message: 'unknown jwt error' }
}
