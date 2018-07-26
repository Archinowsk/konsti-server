/* @flow */
import logger from '/utils/logger'
import db from '/db/mongodb'
import validateAuthHeader from '/utils/authHeader'

// Add blacklist data to server settings
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
    const { username, leader, groupCode, ownSerial } = groupData

    // Create group
    if (leader) {
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
          throw new Error('Failed to sign to group')
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

export { postGroup }
