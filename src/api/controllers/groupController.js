/* @flow */
import { logger } from 'utils/logger'
import { db } from 'db/mongodb'
import { validateAuthHeader } from 'utils/authHeader'
import type { $Request, $Response, Middleware } from 'express'

const postGroup: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/group')

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  const groupData = req.body.groupData
  const { username, leader, groupCode, ownSerial, leaveGroup } = groupData

  if (leaveGroup) {
    const groupMembers = await db.user.findGroupMembers(groupCode)
    let saveGroupResponse

    if (leader && groupMembers.length > 1) {
      res.json({
        message: 'Leader cannot leave non-empty group',
        status: 'error',
        code: 36,
      })
      return
    }

    try {
      saveGroupResponse = await db.user.saveGroupCode('0', username)
    } catch (error) {
      logger.error(`Failed to leave group: ${error}`)
      res.json({
        message: 'Failed to leave group',
        status: 'error',
        code: 35,
      })
      return
    }

    if (saveGroupResponse) {
      res.json({
        message: 'Leave group group success',
        status: 'success',
        groupCode: saveGroupResponse.groupCode,
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

  // Create group
  if (leader) {
    // Check that serial is not used
    let findGroupResponse = null
    try {
      // Check if group exists
      findGroupResponse = await db.user.findGroup(groupCode, username)
    } catch (error) {
      logger.error(`db.user.findUser(): ${error}`)
      res.json({
        message: 'Own group already exists',
        status: 'error',
        code: 34,
      })
      return
    }

    if (findGroupResponse) {
      // Group exists
      res.json({
        message: 'Own group already exists',
        status: 'error',
        code: 34,
      })
      return
    }

    // No existing group, create
    let saveGroupResponse
    try {
      saveGroupResponse = await db.user.saveGroupCode(groupCode, username)
    } catch (error) {
      logger.error(`db.user.saveGroup(): ${error}`)
      res.json({
        message: 'Save group failure',
        status: 'error',
        error,
        code: 30,
      })
    }

    if (saveGroupResponse) {
      res.json({
        message: 'Create group success',
        status: 'success',
        groupCode: saveGroupResponse.groupCode,
      })
    } else {
      res.json({
        message: 'Save group failure',
        status: 'error',
        code: 30,
      })
    }
  }

  // Join group
  if (!leader) {
    // Cannot join own group
    if (ownSerial === groupCode) {
      res.json({
        message: 'Cannot join own group',
        status: 'error',
        code: 33,
      })
      return
    }

    // Check if code is valid
    let findSerialResponse = null
    try {
      findSerialResponse = await db.user.findSerial({ serial: groupCode })
    } catch (error) {
      logger.error(`db.user.findSerial(): ${error}`)
      res.json({
        message: 'Error finding serial',
        status: 'error',
        code: 31,
      })
    }

    // Code is valid
    if (!findSerialResponse) {
      res.json({
        message: 'Invalid group code',
        status: 'error',
        code: 31,
      })
      return
    }

    // Check if group leader has created a group
    let findGroupResponse = null
    try {
      const leaderUsername = findSerialResponse.username
      findGroupResponse = await db.user.findGroup(groupCode, leaderUsername)
    } catch (error) {
      logger.error(`db.user.findGroup(): ${error}`)
      res.json({
        message: 'Error finding group',
        status: 'error',
        code: 32,
      })
    }

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
    let saveGroupResponse
    try {
      saveGroupResponse = await db.user.saveGroupCode(groupCode, username)
    } catch (error) {
      logger.error(`db.user.saveGroup(): ${error}`)
      res.json({
        message: 'Error saving group',
        status: 'error',
        code: 30,
      })
    }

    if (saveGroupResponse) {
      res.json({
        message: 'Joined to group success',
        status: 'success',
        groupCode: saveGroupResponse.groupCode,
      })
    } else {
      logger.error('Failed to sign to group')
      res.json({
        message: 'Failed to update group',
        status: 'error',
        code: 30,
      })
    }
  }
}

// Get group members
const getGroup: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: GET /api/group')

  const groupCode = req.query.groupCode

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  if (!validToken) {
    res.sendStatus(401)
    return
  }

  let findGroupResults = null
  try {
    findGroupResults = await db.user.findGroupMembers(groupCode)

    const returnData = []
    for (let result of findGroupResults) {
      returnData.push({
        groupCode: result.groupCode,
        signedGames: result.signedGames,
        enteredGames: result.enteredGames,
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
