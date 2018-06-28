/* @flow */
import express from 'express'

import { postGames, getGames } from '/api/controllers/gamesController'
import { postUser, getUser } from '/api/controllers/userController'
import { postLogin } from '/api/controllers/loginController'
import { postPlayers } from '/api/controllers/playersController'
import { postSignup } from '/api/controllers/signupController'
import { postFavorite } from '/api/controllers/favoriteController'
import { postBlacklist } from '/api/controllers/blacklistController'
import { postSignupTime } from '/api/controllers/signuptimeController'
import { postFeedback } from '/api/controllers/feedbackController'
import { getSettings } from '/api/controllers/settingsController'
import { getResults } from '/api/controllers/resultsController'

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

export default router
