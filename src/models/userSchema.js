const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  user_group: String,
  favorited_games: [{}],
  signed_games: [{}],
  entered_games: Array,
  created: Date,
  updated_at: Date,
});

// On every save, add the date
UserSchema.pre('save', next => {
  // Add created date
  if (!this.created) this.created = new Date();

  // Add updated_at field
  this.updated_at = new Date();
  next();
});

module.exports = UserSchema;
