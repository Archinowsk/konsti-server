const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  user_group: String,
  favorited_games: [{}],
  signed_games: [{}],
  entered_games: Array,
  created: { type: Date, default: Date.now },
});

module.exports = UserSchema;
