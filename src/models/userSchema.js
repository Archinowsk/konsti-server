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

module.exports = UserSchema
