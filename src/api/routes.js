const express = require('express')

const { postGames, getGames } = require('./controllers/games')
const { postUser, getUser } = require('./controllers/user')
const { postLogin } = require('./controllers/login')
const { postPlayers } = require('./controllers/players')
const { postSignup } = require('./controllers/signup')
const { postFavorite } = require('./controllers/favorite')
const { postBlacklist } = require('./controllers/blacklist')
const { postSignupTime } = require('./controllers/signuptime')
const { postFeedback } = require('./controllers/feedback')
const { getSettings } = require('./controllers/settings')
const { getResults } = require('./controllers/results')

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
