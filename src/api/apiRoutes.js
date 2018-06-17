/* @flow */
const express = require('express')

const { postGames, getGames } = require('./controllers/gamesController')
const { postUser, getUser } = require('./controllers/userController')
const { postLogin } = require('./controllers/loginController')
const { postPlayers } = require('./controllers/playersController')
const { postSignup } = require('./controllers/signupController')
const { postFavorite } = require('./controllers/favoriteController')
const { postBlacklist } = require('./controllers/blacklistController')
const { postSignupTime } = require('./controllers/signuptimeController')
const { postFeedback } = require('./controllers/feedbackController')
const { getSettings } = require('./controllers/settingsController')
const { getResults } = require('./controllers/resultsController')

const router = express.Router()

router.post('/games', postGames)
router.post('/user', postUser)
router.post('/login', postLogin)
router.post('/players', postPlayers)
router.post('/signup', postSignup)
router.post('/favorite', postFavorite)
router.post('/blacklist', postBlacklist)
router.post('/signuptime', postSignupTime)
router.post('/feedback', postFeedback)

router.get('/games', getGames)
router.get('/user', getUser)
router.get('/settings', getSettings)
router.get('/results', getResults)

module.exports = router
