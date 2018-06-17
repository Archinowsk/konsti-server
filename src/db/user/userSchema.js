/* @flow */
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  user_group: String,
  serial: String,
  favorited_games: [{}],
  signed_games: [{}],
  entered_games: [{}],
  created: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

module.exports = User
