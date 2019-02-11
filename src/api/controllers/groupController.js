/* @flow */
import logger from 'utils/logger'
import db from 'db/mongodb'
import validateAuthHeader from 'utils/authHeader'
import arrayToObject from 'utils/arrayToObject'

const postGroup = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/group')
  const groupData = req.body.groupData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
    return
  }

  try {
    const { username, leader, groupCode, ownSerial, leaveGroup } = groupData

    // Create group
    if (leader) {
      // Leave group
      if (leaveGroup) {
        const findGroupResults = await db.user.findGroupMembers(groupCode)

        if (findGroupResults.length > 1) {
          res.json({
            message: 'Leader cannot leave non-empty group',
            status: 'error',
            code: 36,
          })
          return
        } else {
          const saveGroupResponse = await db.user.saveGroup('0', username)

          if (saveGroupResponse) {
            res.json({
              message: 'Leave group group success',
              status: 'success',
            })
            return
          } else {
            logger.error('Failed to leave group')
            res.json({
              message: 'Failed to leave group',
              status: 'error',
              code: 35,
            })
            return
          }
        }
      }

      // Check that serial is not used
      let findGroupResponse = null
      try {
        // Check if group exists
        findGroupResponse = await db.user.findGroup(groupCode, username)
      } catch (error) {
        logger.error(`db.user.findUser(): ${error}`)
      }

      // No existing group, create
      let saveGroupResponse
      if (!findGroupResponse) {
        saveGroupResponse = await db.user.saveGroup(groupCode, username)
      }
      // Group exists
      else {
        res.json({
          message: 'Own group already exists',
          status: 'error',
          code: 34,
        })
        return
      }

      if (saveGroupResponse) {
        res.json({
          message: 'Create group success',
          status: 'success',
        })
      } else {
        throw new Error('Failed to create group')
      }
    }
    // Join group
    else {
      // Leave group
      if (leaveGroup) {
        const saveGroupResponse = await db.user.saveGroup('0', username)

        if (saveGroupResponse) {
          res.json({
            message: 'Leave group group success',
            status: 'success',
          })
          return
        } else {
          logger.error('Failed to leave group')
          res.json({
            message: 'Failed to leave group',
            status: 'error',
            code: 35,
          })
          return
        }
      }

      // Cannot join own group
      if (ownSerial === groupCode) {
        res.json({
          message: 'Cannot join own group',
          status: 'error',
          code: 33,
        })
        return
      }

      let findGroupResponse = null
      let findSerialResponse = null

      // Check if code is valid
      findSerialResponse = await db.user.findSerial({ serial: groupCode })

      // Code is valid
      if (!findSerialResponse) {
        res.json({
          message: 'Invalid group code',
          status: 'error',
          code: 31,
        })
        return
      }

      const leaderUsername = findSerialResponse.username

      // Check if group leader has created a group
      findGroupResponse = await db.user.findGroup(groupCode, leaderUsername)

      // No existing group, cannot join
      if (!findGroupResponse) {
        res.json({
          message: 'Group does not exist',
          status: 'error',
          code: 32,
        })
        return
      }

      // Group exists, join
      else {
        const saveGroupResponse = await db.user.saveGroup(groupCode, username)

        if (saveGroupResponse) {
          res.json({
            message: 'Joined to group success',
            status: 'success',
          })
        } else {
          logger.error('Failed to sign to group')
          res.json({
            message: 'Failed to update group',
            status: 'error',
            code: 30,
          })
          return
        }
      }
    }
  } catch (error) {
    res.json({
      message: 'Add to group failure',
      status: 'error',
      error,
      code: 30,
    })
  }
}

// Get group members
const getGroup = async (req: Object, res: Object) => {
  logger.info('API call: GET /api/group')

  const groupCode = req.query.groupCode

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
    return
  }

  let findGroupResults = null
  try {
    findGroupResults = await db.user.findGroupMembers(groupCode)
    const games = await db.game.findGames()

    const returnData = []
    for (let result of findGroupResults) {
      let enteredGames = []
      let signedGames = []

      enteredGames = result.enteredGames.map(enteredGame => {
        const game = games.filter(game => enteredGame.id === game.id)
        return { ...enteredGame, details: arrayToObject(game) }
      })

      signedGames = result.signedGames.map(signedGame => {
        const game = games.filter(game => signedGame.id === game.id)
        return { ...signedGame, details: arrayToObject(game) }
      })

      returnData.push({
        playerGroup: result.playerGroup,
        signedGames,
        enteredGames,
        serial: result.serial,
        username: result.username,
      })
    }

    res.json({
      message: 'Getting group members success',
      status: 'success',
      results: returnData,
    })
  } catch (error) {
    logger.error(`Results: ${error}`)
    res.json({
      message: 'Getting group members failed',
      status: 'error',
      error,
    })
  }
}

export { postGroup, getGroup }
