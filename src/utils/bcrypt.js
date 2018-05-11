const bcrypt = require('bcryptjs')
const { logger } = require('./logger')

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

module.exports = { hashPassword, comparePasswordHash }
