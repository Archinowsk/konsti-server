const express = require('express');

const postGames = require('./controller/games').postGames;
const postUser = require('./controller/user').postUser;
const postLogin = require('./controller/login').postLogin;
const postPlayers = require('./controller/players').postPlayers;
const postSignup = require('./controller/signup').postSignup;
const postFavorite = require('./controller/favorite').postFavorite;
const postBlacklist = require('./controller/blacklist').postBlacklist;
const postSignupTime = require('./controller/signuptime').postSignupTime;
const postFeedback = require('./controller/feedback').postFeedback;

const getGames = require('./controller/games').getGames;
const getUser = require('./controller/user').getUser;
const getSettings = require('./controller/settings').getSettings;
const getResults = require('./controller/results').getResults;

const router = express.Router();

router.post('/games', postGames);
router.post('/user', postUser);
router.post('/login', postLogin);
router.post('/players', postPlayers);
router.post('/signup', postSignup);
router.post('/favorite', postFavorite);
router.post('/blacklist', postBlacklist);
router.post('/signuptime', postSignupTime);
router.post('/feedback', postFeedback);

router.get('/games', getGames);
router.get('/user', getUser);
router.get('/settings', getSettings);
router.get('/results', getResults);

module.exports = router;
