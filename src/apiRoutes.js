const express = require('express');

const postGames = require('./controller/games').postGames;
const postUser = require('./controller/user').postUser;
const postLogin = require('./controller/login').postLogin;
const postPlayers = require('./controller/players').postPlayers;
const postSignup = require('./controller/signup').postSignup;
const postFavorite = require('./controller/favorite').postFavorite;
const postBlacklist = require('./controller/blacklist').postBlacklist;

const getGames = require('./controller/games').getGames;
const getUser = require('./controller/user').getUser;
const getSettings = require('./controller/settings').getSettings;

const router = express.Router();

router.post('/games', postGames);
router.post('/user', postUser);
router.post('/login', postLogin);
router.post('/players', postPlayers);
router.post('/signup', postSignup);
router.post('/favorite', postFavorite);
router.post('/blacklist', postBlacklist);

router.get('/games', getGames);
router.get('/user', getUser);
router.get('/settings', getSettings);

module.exports = router;
