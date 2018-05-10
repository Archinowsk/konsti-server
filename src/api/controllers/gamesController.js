const requestPromiseNative = require('request-promise-native')

const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const validateAuthHeader = require('../../utils/authHeader')
const config = require('../../../config')

const updateGames = () => {
  logger.info('Games: GET games from Conbase')

  const options = {
    uri: config.dataUri,
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true, // Automatically parses the JSON string in the response
  }

  return requestPromiseNative(options).then(
    response => {
      if (response.success === true) {
        logger.info(`Games: GET Games success`)
      }

      // TODO: Filter roleplaying games in designated locations, i.e. not "hall 5"

      const games = []
      response.forEach(game => {
        game.tags.forEach(tag => {
          if (tag === 'Pöytäpelit') {
            games.push(game)
          }
        })
      })
      return games
    },
    error => {
      logger.error(`Games: requestPromiseNative(): ${error}`)
      return Promise.reject(error)
    }
  )
}

// Update games db from Conbase
const postGames = (req, res) => {
  logger.info('API call: POST /api/games')

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
  }

  return updateGames().then(
    response =>
      db.storeGamesData(response).then(
        response2 => {
          res.json({
            message: 'Games db updated',
            status: 'success',
            data: response2,
          })
        },
        error => {
          res.json({
            message: 'Games db update failed',
            status: 'error',
            data: error,
          })
          Promise.reject(error)
        }
      ),
    error => {
      logger.error(`Games: ${error}`)
    }
  )
}

// Get games from db
const getGames = (req, res) => {
  logger.info('API call: GET /api/games')

  db.getGamesData().then(
    response => {
      res.json({
        message: 'Games downloaded',
        status: 'success',
        games: response,
      })
    },
    error => {
      res.json({
        message: 'Downloading games failed',
        status: 'error',
        response: error,
      })
    }
  )
}

module.exports = { postGames, getGames }
