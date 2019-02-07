/* @flow */
import bcrypt from 'bcryptjs'
import logger from '/utils/logger'

const saltRounds = 10

const hashPassword = async (password: string) => {
  let response = null
  try {
    response = await bcrypt.hash(password, saltRounds)
    return response
  } catch (error) {
    logger.error(error)
  }
}

const comparePasswordHash = async (password: string, hash: string) => {
  let response = null
  try {
    response = await bcrypt.compare(password, hash)
    return response
  } catch (error) {
    logger.error(error)
  }
}

export { hashPassword, comparePasswordHash }
