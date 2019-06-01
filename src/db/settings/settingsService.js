/* @flow */
import moment from 'moment'
import logger from 'utils/logger'
import Settings from 'db/settings/settingsSchema'
import type { Game } from 'flow/game.flow'

const removeSettings = () => {
  logger.info('MongoDB: remove ALL settings from db')
  return Settings.deleteMany({})
}

const createSettings = async () => {
  logger.info('MongoDB: "Settings" collection not found, create empty')

  const settings = new Settings({
    hiddenGames: [],
    canceledGames: [],
    signupTime: moment('2018-07-27T15:00:00.000Z'),
  })

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

const findSettings = async () => {
  let response = null
  try {
    response = await Settings.findOne({})
      .lean()
      .populate('hiddenGames')
  } catch (error) {
    logger.error(`MongoDB: Error finding settings data - ${error}`)
    return error
  }

  if (response === null) {
    // No settings data, create new collection
    return createSettings()
  }
  logger.debug(`MongoDB: Settings data found`)
  return response
}

const saveHidden = async (hiddenData: Array<Game>) => {
  let response = null
  try {
    response = await Settings.updateOne({
      $set: {
        hiddenGames: hiddenData.map(game => {
          return game._id
        }),
      },
    })
    logger.info(`MongoDB: Hidden data updated`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error updating hidden data - ${error}`)
    return error
  }
}

const saveSignupTime = async (signupTime: Date) => {
  // Make sure that the string is in correct format
  let formattedTime
  if (signupTime === null) {
    formattedTime = moment('2018-07-27T15:00:00.000Z')
  } else {
    formattedTime = moment(signupTime)
  }

  let response = null
  try {
    response = await Settings.updateOne({
      $set: { signupTime: formattedTime },
    })
    logger.info(`MongoDB: Signup time updated`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error updating signup time - ${error}`)
    return error
  }
}

const settings = {
  findSettings,
  removeSettings,
  saveHidden,
  saveSignupTime,
}

export default settings
