const bcrypt = require('bcryptjs')
const logger = require('./logger').logger

const saltRounds = 10

const hashPassword = password =>
  bcrypt.hash(password, saltRounds).then(response => response)

const comparePasswordHash = (password, hash) =>
  bcrypt.compare(password, hash).then(response => response)

module.exports = { hashPassword, comparePasswordHash }
