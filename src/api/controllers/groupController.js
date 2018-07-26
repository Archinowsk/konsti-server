/* @flow */
import logger from '/utils/logger'
// import db from '/db/mongodb'
import validateAuthHeader from '/utils/authHeader'

// Add blacklist data to server settings
const postGroup = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/group')
  const groupData = req.body.groupData

  const authHeader = req.headers.authorization
  const validToken = validateAuthHeader(authHeader, 'user')

  console.log('groupData')
  console.log(groupData)

  if (!validToken) {
    res.json({
      code: 401,
      message: 'Unauthorized',
      status: 'error',
    })
    return
  }

  try {
    // await db.settings.saveBlacklist(groupData)
    res.json({
      message: 'Add to group success',
      status: 'success',
    })
  } catch (error) {
    res.json({
      message: 'Add to group failure',
      status: 'error',
      error,
    })
  }
}

export { postGroup }
