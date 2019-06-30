/* @flow */
import { logger } from 'utils/logger'
import { User } from 'db/user/userSchema'
import type { Result, Signup } from 'flow/result.flow'
import type { NewUserData } from 'flow/user.flow'

const removeUsers = () => {
  logger.info('MongoDB: remove ALL users from db')
  return User.deleteMany({})
}

const saveUser = async (newUserData: NewUserData) => {
  const username = newUserData.username.trim()

  const user = new User({
    username,
    password: newUserData.passwordHash,
    userGroup:
      typeof newUserData.userGroup === 'string'
        ? newUserData.userGroup
        : 'user', // Options: 'user' and 'admin'
    serial: newUserData.serial,
    groupCode:
      typeof newUserData.groupCode === 'string' ? newUserData.groupCode : '0',
    favoritedGames: newUserData.favoritedGames || [],
    signedGames: newUserData.signedGames || [],
    enteredGames: newUserData.enteredGames || [],
  })

  let response = null
  try {
    response = await user.save()
    logger.info(`MongoDB: User "${username}" saved to DB`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error creating new user ${username} - ${error}`)
    return error
  }
}

const findUser = async (username: string) => {
  let response = null
  try {
    response = await User.findOne(
      { username },
      '-signedGames._id -enteredGames._id'
    )
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails')
  } catch (error) {
    logger.error(`MongoDB: Error finding user ${username} - ${error}`)
    return error
  }

  if (!response) {
    logger.info(`MongoDB: User "${username}" not found`)
  } else {
    logger.debug(`MongoDB: Found user "${username}"`)
  }
  return response
}

const findSerial = async (serialData: Object) => {
  const serial = serialData.serial

  let response = null
  try {
    response = await User.findOne({ serial }).lean()
  } catch (error) {
    logger.error(`MongoDB: Error finding Serial ${serial} - ${error}`)
    return error
  }

  if (!response) {
    logger.info(`MongoDB: Serial "${serial}" not found`)
  } else {
    logger.info(`MongoDB: Found Serial "${serial}"`)
  }
  return response
}

const findGroupMembers = async (groupCode: string) => {
  let response = null
  try {
    response = await User.find({ groupCode })
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails')
  } catch (error) {
    logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`)
    return error
  }

  if (!response || response.length === 0) {
    logger.info(`MongoDB: group "${groupCode}" not found`)
  } else {
    logger.info(
      `MongoDB: Found group "${groupCode}" with ${response.length} members`
    )
  }
  return response
}

const findGroup = async (groupCode: string, username: string) => {
  let response = null
  if (username) {
    try {
      response = await User.findOne({ groupCode, username }).lean()
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`)
      return error
    }

    if (!response) {
      logger.info(
        `MongoDB: Group "${groupCode}" with leader "${username}" not found`
      )
    } else {
      logger.info(
        `MongoDB: Group "${groupCode}" with leader "${username}" found`
      )
    }
    return response
  } else {
    try {
      response = await User.findOne(groupCode).lean()
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${groupCode} - ${error}`)
      return error
    }

    if (!response) {
      logger.info(`MongoDB: Group "${groupCode}" not found`)
    } else {
      logger.info(`MongoDB: Group "${groupCode}" found`)
    }
    return response
  }
}

const findUsers = async () => {
  let response = null
  try {
    response = await User.find({})
      .lean()
      .populate('favoritedGames')
      .populate('enteredGames.gameDetails')
      .populate('signedGames.gameDetails')
    logger.info(`MongoDB: Find all users`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error fetcing users - ${error}`)
    return error
  }
}

const saveSignup = async (signupData: Signup) => {
  const { signedGames, username } = signupData

  let signupResponse = null
  try {
    signupResponse = await User.findOneAndUpdate(
      { username: username },
      {
        signedGames: signedGames.map(signedGame => {
          return {
            gameDetails: signedGame.gameDetails._id,
            priority: signedGame.priority,
            time: signedGame.time,
          }
        }),
      },
      { new: true, fields: '-signedGames._id' }
    ).populate('signedGames.gameDetails')
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup data for user "${username}" - ${error}`
    )
    return error
  }

  logger.info(`MongoDB: Signup data stored for user "${username}"`)
  return signupResponse
}

const saveGroupCode = async (groupCode: string, username: string) => {
  let response = null

  try {
    response = await User.findOneAndUpdate(
      { username: username },
      { groupCode: groupCode },
      { new: true, fields: 'groupCode' }
    )
  } catch (error) {
    logger.error(
      `MongoDB: Error storing group "${groupCode}" stored for user "${username}" - ${error}`
    )
    return error
  }

  if (groupCode === '0') {
    logger.info(`MongoDB: User "${username}" left group`)
  } else {
    logger.info(`MongoDB: Group "${groupCode}" stored for user "${username}"`)
  }
  return response
}

const saveFavorite = async (favoriteData: Object) => {
  let response = null
  try {
    response = await User.findOneAndUpdate(
      { username: favoriteData.username },
      {
        favoritedGames: favoriteData.favoritedGames.map(game => {
          return game._id
        }),
      },
      { new: true, fields: 'favoritedGames' }
    )
      .lean()
      .populate('favoritedGames')

    logger.info(
      `MongoDB: Favorite data stored for user "${favoriteData.username}"`
    )
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing favorite data for user "${favoriteData.username}" - ${error}`
    )
    return error
  }
}

const saveSignupResult = async (signupResult: Result) => {
  let response = null
  try {
    const user = await findUser(signupResult.username)

    let enteredGames = []
    if (user.enteredGames.length === 0) {
      enteredGames = signupResult.enteredGame
    } else {
      enteredGames = user.enteredGames.map(enteredGame => {
        if (enteredGame.time === signupResult.enteredGame.time) {
          return signupResult.enteredGame
        } else {
          return enteredGame
        }
      })
    }

    response = await User.updateOne(
      {
        username: signupResult.username,
      },
      {
        enteredGames,
      }
    )

    logger.info(
      `MongoDB: Signup result data stored for user "${signupResult.username}"`
    )
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup result data for user ${signupResult.username} - ${error}`
    )
    return error
  }
}

export const user = {
  findSerial,
  findUser,
  findGroup,
  findUsers,
  removeUsers,
  saveFavorite,
  saveSignup,
  saveSignupResult,
  saveUser,
  findGroupMembers,
  saveGroupCode,
}
