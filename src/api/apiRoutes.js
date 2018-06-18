/* @flow */
import express from 'express'

import { postGames, getGames } from './controllers/gamesController'
import { postUser, getUser } from './controllers/userController'
import { postLogin } from './controllers/loginController'
import { postPlayers } from './controllers/playersController'
import { postSignup } from './controllers/signupController'
import { postFavorite } from './controllers/favoriteController'
import { postBlacklist } from './controllers/blacklistController'
import { postSignupTime } from './controllers/signuptimeController'
import { postFeedback } from './controllers/feedbackController'
import { getSettings } from './controllers/settingsController'
import { getResults } from './controllers/resultsController'

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
