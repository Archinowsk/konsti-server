const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  user_group: String,
  favorited_games: [{}],
  signed_games: [{}],
  entered_games: Array,
  created: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

// On every save, add the date
UserSchema.pre('save', next => {
  // Add updated_at field
  this.updated_at = new Date();
  next();
});

module.exports = UserSchema;
