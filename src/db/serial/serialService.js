/* @flow */
import logger from '/utils/logger'
import Serial from '/db/serial/serialSchema'

const removeSerials = () => {
  logger.info('MongoDB: remove ALL serials from db')
  return Serial.remove({})
}

const saveSerials = async (serials: Array<string>) => {
  const serialDocs = []

  for (let serial of serials) {
    serialDocs.push(
      new Serial({
        serial,
      })
    )
  }

  let response = null
  try {
    await Serial.create(serialDocs)
    logger.info(`MongoDB: Serials data saved`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error saving serials data - ${error}`)
    return error
  }
}

const findSerial = async (serial: string) => {
  let response = null
  try {
    response = await Serial.findOne({ serial })
  } catch (error) {
    logger.error(`MongoDB: Error finding serial ${serial} - ${error}`)
    return error
  }

  if (!response) {
    logger.info(`MongoDB: Serial "${serial}" not found`)
    return false
  } else {
    logger.info(`MongoDB: Found serial "${serial}"`)
    return true
  }
}

const serial = { removeSerials, findSerial, saveSerials }

export default serial
