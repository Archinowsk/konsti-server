const jwt = require('jsonwebtoken');
const logger = require('../utils/logger').logger;
const config = require('../../config');

const jwtSecretKey = config.jwtSecretKey;
