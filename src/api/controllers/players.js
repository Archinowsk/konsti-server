const { logger } = require('../../utils/logger')
const db = require('../../db/mongodb')
const assignPlayers = require('../../utils/munkres').assignPlayers
const validateAuthHeader = require('../../utils/authHeader')

const storeMultiple = signups => {
  return Promise.all(
    signups.map(async signup => {
      return db.storeSignupResultData(signup)
    })
  )
}

// Assign players to games
const postPlayers = (req, res) => {
  logger.info('API call: POST /api/players')
  const startingTime = req.body.startingTime

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'admin')

  if (!validToken) {
    res.json({
      code: 31,
      message: 'Unauthorized',
      status: 'error',
    })
    return undefined
  }

  return db.getUsersData().then(
    users => {
      db.getGamesData().then(
        games => {
          assignPlayers(users, games, startingTime).then(
            assignResults => {
              db.storeAllSignupResults(assignResults, startingTime).then(
                () => {
                  storeMultiple(assignResults).then(
                    () => {
                      res.json({
                        message: 'Players assign success',
                        status: 'success',
                        results: assignResults,
                      })
                    },
                    error => {
                      logger.error(`Players: ${error}`)
                      res.json({
                        message: 'Players assign failure',
                        status: 'error',
                        error,
                      })
                    }
                  )
                },
                error => {
                  console.log(error)
                }
              )
            },
            error => {
              logger.error(`Players: ${error}`)
              res.json({
                message: 'Players assign failure',
                status: 'error',
                error,
              })
            }
          )
        },
        error => {
          logger.error(`Players: ${error}`)
          res.json({
            message: 'Players assign failure',
            status: 'error',
            error,
          })
        }
      )
    },
    error => {
      logger.error(`Players: ${error}`)
      res.json({
        message: 'Players assign failure',
        status: 'error',
        error,
      })
    }
  )
}

module.exports = { postPlayers }
