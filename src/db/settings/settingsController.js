const moment = require('moment')
const { logger } = require('../../utils/logger')
const Settings = require('./settingsSchema')

const removeSettings = () => {
  logger.info('MongoDB: remove ALL settings from db')
  return Settings.remove({})
}

const createSettingsData = async () => {
  logger.info('MongoDB: "Settings" collection not found, create empty')

  // Example user data
  const settings = new Settings({
    blacklisted_games: [],
    canceled_games: [],
    signup_time: moment.utc('2000-01-01'),
  })

  // Save to database
  let response = null
  try {
    response = await settings.save()
    logger.info(`MongoDB: Empty settings collection saved to DB`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error creating empty settings collection - ${error}`)
    return error
  }
}

const getSettingsData = async () => {
  let response = null
  try {
    response = await Settings.findOne({})
  } catch (error) {
    logger.error(`MongoDB: Error finding settings data - ${error}`)
    return error
  }

  if (response === null) {
    // No settings data, create new collection
    return createSettingsData(response2 => response2)
  }
  logger.info(`MongoDB: Settings data found`)
  return response
}

const storeBlacklistData = async blacklistData => {
  // Save to database
  let response = null
  try {
    response = await Settings.update({
      $set: { blacklisted_games: blacklistData.blacklistedGames },
    })
    logger.info(`MongoDB: Blacklist data updated`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error updating blacklist data - ${error}`)
    return error
  }
}

const storeSignupTime = async signupTime => {
  // Make sure that the string is in correct format
  let formattedTime
  if (signupTime === null) {
    formattedTime = moment.utc('2000-01-01')
  } else {
    formattedTime = moment.utc(signupTime)
  }

  // Save to database
  let response = null
  try {
    response = await Settings.update({
      $set: { signup_time: formattedTime },
    })
    logger.info(`MongoDB: Signup time updated`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error updating signup time - ${error}`)
    return error
  }
}

module.exports = {
  storeBlacklistData,
  storeSignupTime,
  removeSettings,
  getSettingsData,
}
