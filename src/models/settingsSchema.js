const mongoose = require('mongoose');

const SettingsSchema = mongoose.Schema({
  blacklisted_games: Array,
  canceled_games: Array,
});

module.exports = SettingsSchema;
