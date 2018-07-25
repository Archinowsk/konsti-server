/* @flow */
import logger from '/utils/logger'
import db from '/db/mongodb'
import validateAuthHeader from '/utils/authHeader'

// Add signup data for user
const postSignup = async (req: Object, res: Object) => {
  logger.info('API call: POST /api/signup')
  const signupData = req.body.signupData

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
    await db.user.saveSignup(signupData)
    const user = await db.user.findUser(signupData)
    const games = await db.game.findGames()

    const arrayToObject = array =>
      array.reduce((obj, item) => {
        obj = item
        return obj
      }, {})

    let signedGames = []
    if (user && user.signedGames) {
      signedGames = user.signedGames.map(signedGame => {
        const game = games.filter(game => signedGame.id === game.id)
        return { ...signedGame, details: arrayToObject(game) }
      })
    }

    res.json({
      message: 'Signup success',
      status: 'success',
      signedGames,
    })
  } catch (error) {
    res.json({
      message: 'Signup failure',
      status: 'error',
      error,
    })
  }
}

export { postSignup }
