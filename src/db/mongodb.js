// Load mongoose package
const mongoose = require('mongoose')
const moment = require('moment')
const logger = require('../utils/logger').logger
const UserSchema = require('./models/userSchema')
const GameSchema = require('./models/gameSchema')
const SettingsSchema = require('./models/settingsSchema')
const ResultsSchema = require('./models/resultsSchema')
const FeedbackSchema = require('./models/feedbackSchema')

const config = require('../../config')

const connectToDb = async () => {
  // Use native Node promises
  mongoose.Promise = global.Promise

  // Connect to MongoDB and create/use database
  try {
    await mongoose.connect(config.db)
    logger.info('MongoDB: Connection succesful')
  } catch (error) {
    logger.error(`MongoDB: Error connecting to DB: ${error}`)
    process.exit()
  }
}

const gracefulExit = () => {
  mongoose.connection.close(() => {
    logger.info(`MongoDB: ${config.db} is disconnected through app termination`)
    process.exit(0)
  })
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)

const removeUsers = () => {
  logger.info('MongoDB: remove ALL users from db')
  const User = mongoose.model('User', UserSchema)
  return User.remove({})
}

const removeGames = () => {
  logger.info('MongoDB: remove ALL games from db')

  const Game = mongoose.model('Game', GameSchema)
  return Game.remove({})
}

const storeUserData = userData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)
  const username = userData.username.trim()
  let userGroup = 'user'

  if (userData.user_group) {
    userGroup = userData.user_group
  }

  // User data
  const user = new User({
    username,
    password: userData.passwordHash,
    user_group: userGroup, // Options: 'user' and 'admin'
    serial: userData.serial,
    favorited_games: [],
    signed_games: [],
    entered_games: [],
  })

  // Save to database
  return user.save().then(
    response => {
      logger.info(`MongoDB: User ${username} saved to DB`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error creating new user ${username} - ${error}`)
      return error
    }
  )
}

// Store all games to db
const storeGamesData = games => {
  logger.info('MongoDB: Store games to DB')
  // Create a model based on the schema
  const Game = mongoose.model('Game', GameSchema)

  const gameDocs = []

  let attendance
  let minAttendance = 0
  let maxAttendance = 0

  const isInt = n => n % 1 === 0

  games.forEach(game => {
    const people = []

    // Combine date and time
    let date = moment.utc(game.date)
    const hours = game.time.substring(0, game.time.indexOf(':'))
    date = moment(date).add(hours, 'hours')

    // Parse min and max attendance number from string
    if (game.attendance) {
      attendance = game.attendance.replace(/\s/g, '').replace('–', '-')
      if (attendance.includes('-')) {
        minAttendance = attendance.substring(0, attendance.indexOf('-'))
        maxAttendance = attendance.substring(attendance.lastIndexOf('-') + 1)
      } else if (isInt(attendance)) {
        minAttendance = attendance
        maxAttendance = attendance
      } else {
        logger.error(
          `Game "${game.title}" has invalid attendance ${attendance}`
        )
      }
    } else {
      logger.error(`Game "${game.title}" is missing attendance`)
    }

    // Get names without Conbase ids
    game.people.forEach(person => {
      people.push(person.name)
    })

    const gameDoc = new Game({
      id: game.id,
      title: game.title,
      description: game.desc,
      notes: game.notes,
      location: game.loc[0],
      date,
      // time: game.time,
      mins: game.mins,
      tags: game.tags,
      people,
      min_attendance: minAttendance,
      max_attendance: maxAttendance,
      attributes: game.attributes,
      table: game.table,
    })

    gameDocs.push(gameDoc)
  })

  // Remove existing documents
  return removeGames().then(
    () =>
      Game.create(gameDocs).then(
        response => {
          logger.info('MonboDB: Games saved to DB succesfully')
          return response
        },
        // TODO: Collect and return all errors, now only catches one
        error => {
          logger.error(`Error saving game to db: ${error}`)
          return Promise.reject(error)
        }
      ),
    error => {
      logger.error(`Error removing old db entries: ${error}`)
      return Promise.reject(error)
    }
  )
}

const getUserData = userData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)
  const username = userData.username.trim()

  // TODO: Update to use findOne() instead of find()
  // return User.findOne({ username: userData.username }).then(
  return User.find({ username }).then(
    response => {
      if (response.length === 0) {
        logger.info(`MongoDB: User "${username}" not found`)
      } else {
        logger.info(`MongoDB: Found user "${username}"`)
      }
      return response
    },
    error => {
      logger.error(`MongoDB: Error finding user ${username} - ${error}`)
      return error
    }
  )
}

const getUserSerial = serialData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)
  // const username = userData.username.trim();
  const serial = serialData.serial
  logger.info('serial')

  logger.info(serial)
  // TODO: Update to use findOne() instead of find()
  // return User.findOne({ username: userData.username }).then(
  return User.find({ serial }).then(
    response => {
      if (response.length === 0) {
        logger.info(`MongoDB: Serial "${serial}" not found`)
      } else {
        logger.info(`MongoDB: Found Serial "${serial}"`)
      }
      return response
    },
    error => {
      logger.error(`MongoDB: Error finding Serial ${serial} - ${error}`)
      return error
    }
  )
}

const createSettingsData = () => {
  // Create a model based on the schema
  const Settings = mongoose.model('Settings', SettingsSchema)
  logger.info('MongoDB: "Settings" collection not found, create empty')
  // Example user data
  const settings = new Settings({
    blacklisted_games: [],
    canceled_games: [],
    signup_time: moment.utc('2000-01-01'),
  })

  // Save to database
  return settings.save().then(
    response => {
      logger.info(`MongoDB: Empty settings collection saved to DB`)
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error creating empty settings collection - ${error}`
      )
      return error
    }
  )
}

const getSettingsData = () => {
  // Create a model based on the schema
  const Settings = mongoose.model('Settings', SettingsSchema)

  return Settings.findOne({}).then(
    response => {
      if (response === null) {
        // No settings data, create new collection
        return createSettingsData(response2 => response2)
      }
      logger.info(`MongoDB: Settings data found`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error finding settings data - ${error}`)
      return error
    }
  )
}

const getResultsData = () => {
  // Create a model based on the schema
  const Results = mongoose.model('Results', ResultsSchema)

  return Results.find({}).then(
    response => {
      /*
      if (response === null) {
        // No settings data, create new collection
        return createSettingsData(response2 => response2);
      }
      */
      logger.info(`MongoDB: Results data found`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error finding results data - ${error}`)
      return error
    }
  )
}

const getGamesData = () => {
  // Create a model based on the schema
  const Game = mongoose.model('Game', GameSchema)

  return Game.find({}).then(
    response => {
      logger.info(`MongoDB: Get all games`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error fetcing games - ${error}`)
      return error
    }
  )
}

const getUsersData = () => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)

  return User.find({}).then(
    response => {
      logger.info(`MongoDB: Get all users`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error fetcing users - ${error}`)
      return error
    }
  )
}

const storeSignupData = signupData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)

  // Save to database
  return User.update(
    { username: signupData.username },
    { $set: { signed_games: signupData.selectedGames } }
  ).then(
    response => {
      logger.info(
        `MongoDB: Signup data stored for user "${signupData.username}"`
      )
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error storing signup data for user "${
          signupData.username
        }" - ${error}`
      )
      return error
    }
  )
}

const storeFavoriteData = favoriteData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)

  // Save to database
  return User.update(
    { username: favoriteData.username },
    { $set: { favorited_games: favoriteData.favoritedGames } }
  ).then(
    response => {
      logger.info(
        `MongoDB: Favorite data stored for user "${favoriteData.username}"`
      )
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error storing favorite data for user "${
          favoriteData.username
        }" - ${error}`
      )
      return error
    }
  )
}

const storeBlacklistData = blacklistData => {
  // Create a model based on the schema
  const Settings = mongoose.model('Settings', SettingsSchema)

  // Save to database
  return Settings.update({
    $set: { blacklisted_games: blacklistData.blacklistedGames },
  }).then(
    response => {
      logger.info(`MongoDB: Blacklist data updated`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error updating blacklist data - ${error}`)
      return error
    }
  )
}

const storeSignupTime = signupTime => {
  // Create a model based on the schema
  const Settings = mongoose.model('Settings', SettingsSchema)
  // Make sure that the string is in correct format
  let formattedTime
  if (signupTime === null) {
    formattedTime = moment.utc('2000-01-01')
  } else {
    formattedTime = moment.utc(signupTime)
  }
  // Save to database
  return Settings.update({
    $set: { signup_time: formattedTime },
  }).then(
    response => {
      logger.info(`MongoDB: Signup time updated`)
      return response
    },
    error => {
      logger.error(`MongoDB: Error updating signup time - ${error}`)
      return error
    }
  )
}

const storeSignupResultData = signupResultData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)

  // Save to database, don't store duplicate ids
  return User.update(
    {
      username: signupResultData.username,
      entered_games: { $ne: [{ id: signupResultData.enteredGame.id }] },
    },
    // { $set: { entered_games: { id: signupResultData.enteredGame } } }
    { $push: { entered_games: { id: signupResultData.enteredGame.id } } }
  ).then(
    response => {
      logger.info(
        `MongoDB: Signup result data stored for user ${
          signupResultData.username
        }`
      )
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error storing signup result data for user ${
          signupResultData.username
        } - ${error}`
      )
      return error
    }
  )
}

const storeAllSignupResults = (signupResultData, startingTime) => {
  // Store to separate "results" collection
  const Results = mongoose.model('Results', ResultsSchema)
  const formattedTime = moment.utc(startingTime)

  // Example user data
  const results = new Results({
    result: signupResultData,
    time: formattedTime,
  })

  // Save to database
  return results.save().then(
    response => {
      logger.info(`MongoDB: Signup results stored to separate collection`)
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error storing signup results to separate collection - ${error}`
      )
      return error
    }
  )
}

const storeFeedbackData = feedbackData => {
  // Store to separate "results" collection
  const Feedback = mongoose.model('Feedback', FeedbackSchema)

  // Example user data
  const feedback = new Feedback({
    game_id: feedbackData.id,
    feedback: feedbackData.feedback,
  })

  // Save to database
  return feedback.save().then(
    response => {
      logger.info(`MongoDB: Feedback stored success`)
      return response
    },
    error => {
      logger.error(`MongoDB: Feedback stored error - ${error}`)
      return error
    }
  )
}

const storeFavoriteGamesData = favoriteGamesData => {
  // Create a model based on the schema
  const User = mongoose.model('User', UserSchema)

  // Save to database
  return User.update(
    { username: favoriteGamesData.username },
    { $set: { favorite_games: favoriteGamesData.enteredGames } }
  ).then(
    response => {
      logger.info(
        `MongoDB: Favorites data stored for user ${favoriteGamesData.username}`
      )
      return response
    },
    error => {
      logger.error(
        `MongoDB: Error storing favorites data for user ${
          favoriteGamesData.username
        } - ${error}`
      )
      return error
    }
  )
}

module.exports = {
  connectToDb,
  storeGamesData,
  storeUserData,
  getUserData,
  getGamesData,
  getUsersData,
  storeSignupData,
  storeFavoriteData,
  storeBlacklistData,
  storeSignupTime,
  storeSignupResultData,
  storeFavoriteGamesData,
  removeUsers,
  removeGames,
  getSettingsData,
  storeAllSignupResults,
  getResultsData,
  storeFeedbackData,
  getUserSerial,
}
