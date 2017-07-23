const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  id: String,
  username: String,
  password: String,
  user_group: String,
  favorited_games: [{}],
  signed_games: [{}],
  entered_games: Array,
  updated_at: { type: Date, default: Date.now },
});

// On every save, add the date
UserSchema.pre('save', next => {
  // Change the updated_at field to current date
  this.updated_at = new Date();
  next();
});

module.exports = UserSchema;
