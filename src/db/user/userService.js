/* @flow */
import logger from '/utils/logger'
import User from '/db/user/userSchema'

const removeUsers = () => {
  logger.info('MongoDB: remove ALL users from db')
  return User.remove({})
}

const saveUser = async (userData: Object) => {
  const username = userData.username.trim()

  // User data
  const user = new User({
    username,
    password: userData.passwordHash,
    userGroup: userData.userGroup || 'user', // Options: 'user' and 'admin'
    serial: userData.serial,
    playerGroup: userData.playerGroup || 0,
    favoritedGames: userData.favoritedGames || [],
    signedGames: userData.signedGames || [],
    enteredGames: userData.enteredGames || [],
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

const findUser = async (userData: Object) => {
  const username = userData.username.trim()

  let response = null
  try {
    response = await User.findOne({ username })
  } catch (error) {
    logger.error(`MongoDB: Error finding user ${username} - ${error}`)
    return error
  }

  if (!response) {
    logger.info(`MongoDB: User "${username}" not found`)
  } else {
    logger.info(`MongoDB: Found user "${username}"`)
  }
  return response
}

const findSerial = async (serialData: Object) => {
  const serial = serialData.serial

  let response = null
  try {
    response = await User.findOne({ serial })
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

const findGroupMembers = async (playerGroup: string) => {
  let response = null
  try {
    response = await User.find({ playerGroup: parseInt(playerGroup, 10) })
  } catch (error) {
    logger.error(`MongoDB: Error finding group ${playerGroup} - ${error}`)
    return error
  }

  if (!response || response.length === 0) {
    logger.info(`MongoDB: group "${playerGroup}" not found`)
  } else {
    logger.info(
      `MongoDB: Found group "${playerGroup}" with ${response.length} members`
    )
  }
  return response
}

const findGroup = async (playerGroup: string, username: string) => {
  let response = null
  if (username) {
    try {
      response = await User.findOne({ playerGroup, username })
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${playerGroup} - ${error}`)
      return error
    }

    if (!response) {
      logger.info(
        `MongoDB: Group "${playerGroup}" with leader "${username}" not found`
      )
    } else {
      logger.info(
        `MongoDB: Group "${playerGroup}" with leader "${username}" found`
      )
    }
    return response
  } else {
    try {
      response = await User.findOne(playerGroup)
    } catch (error) {
      logger.error(`MongoDB: Error finding group ${playerGroup} - ${error}`)
      return error
    }

    if (!response) {
      logger.info(`MongoDB: Group "${playerGroup}" not found`)
    } else {
      logger.info(`MongoDB: Group "${playerGroup}" found`)
    }
    return response
  }
}

const findUsers = async () => {
  let response = null
  try {
    response = await User.find({})
    logger.info(`MongoDB: Find all users`)
    return response
  } catch (error) {
    logger.error(`MongoDB: Error fetcing users - ${error}`)
    return error
  }
}

const saveSignup = async (signupData: Object) => {
  const { selectedGames, username } = signupData

  let signupResponse = null
  try {
    signupResponse = await User.update(
      { username: username },
      { $set: { signedGames: selectedGames } }
    )
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup data for user "${username}" - ${error}`
    )
    return error
  }

  logger.info(`MongoDB: Signup data stored for user "${username}"`)
  return signupResponse
}

const saveGroup = async (groupCode: number, username: string) => {
  let response = null
  try {
    response = await User.update(
      { username: username },
      { $set: { playerGroup: parseInt(groupCode, 10) } }
    )
  } catch (error) {
    logger.error(
      `MongoDB: Error storing group "${groupCode}" stored for user "${username}" - ${error}`
    )
    return error
  }

  if (groupCode === 0) {
    logger.info(`MongoDB: User "${username}" left group`)
  } else {
    logger.info(`MongoDB: Group "${groupCode}" stored for user "${username}"`)
  }
  return response
}

const saveFavorite = async (favoriteData: Object) => {
  let response = null
  try {
    response = await User.update(
      { username: favoriteData.username },
      { $set: { favoritedGames: favoriteData.favoritedGames } }
    )

    logger.info(
      `MongoDB: Favorite data stored for user "${favoriteData.username}"`
    )
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing favorite data for user "${
        favoriteData.username
      }" - ${error}`
    )
    return error
  }
}

const saveSignupResult = async (signupResultData: Object) => {
  let response = null
  try {
    response = await User.update(
      {
        username: signupResultData.username,
        enteredGames: { $ne: [{ id: signupResultData.enteredGame.id }] },
      },
      // { $set: { enteredGames: { id: signupResultData.enteredGame } } }
      { $push: { enteredGames: { id: signupResultData.enteredGame.id } } }
    )

    logger.info(
      `MongoDB: Signup result data stored for user "${
        signupResultData.username
      }"`
    )
    return response
  } catch (error) {
    logger.error(
      `MongoDB: Error storing signup result data for user ${
        signupResultData.username
      } - ${error}`
    )
    return error
  }
}

const user = {
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
  saveGroup,
}

export default user
