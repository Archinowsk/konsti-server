const express = require('express')

const postGames = require('./controllers/games').postGames
const postUser = require('./controllers/user').postUser
const postLogin = require('./controllers/login').postLogin
const postPlayers = require('./controllers/players').postPlayers
const postSignup = require('./controllers/signup').postSignup
const postFavorite = require('./controllers/favorite').postFavorite
const postBlacklist = require('./controllers/blacklist').postBlacklist
const postSignupTime = require('./controllers/signuptime').postSignupTime
const postFeedback = require('./controllers/feedback').postFeedback

const getGames = require('./controllers/games').getGames
const getUser = require('./controllers/user').getUser
const getSettings = require('./controllers/settings').getSettings
const getResults = require('./controllers/results').getResults

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
