/* @flow */
import bcrypt from 'bcryptjs'
import logger from 'utils/logger'

const saltLength = 10

const hashPassword = async (password: string): Promise<any> => {
  try {
    return await bcrypt.hash(password, saltLength)
  } catch (error) {
    logger.error(error)
  }
}

const comparePasswordHash = async (
  password: string,
  hash: string
): Promise<any> => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    logger.error(error)
  }
}

export { hashPassword, comparePasswordHash }
