import bcrypt from 'bcryptjs'
import { logger } from './logger'

const saltRounds = 10

const hashPassword = async password => {
  let response = null
  try {
    response = await bcrypt.hash(password, saltRounds)
    return response
  } catch (error) {
    logger.error(error)
  }
}

const comparePasswordHash = async (password, hash) => {
  let response = null
  try {
    response = await bcrypt.compare(password, hash)
    return response
  } catch (error) {
    logger.error(error)
  }
}

export { hashPassword, comparePasswordHash }
