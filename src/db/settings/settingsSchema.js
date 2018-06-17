/* @flow */
const mongoose = require('mongoose')

const SettingsSchema = mongoose.Schema({
  blacklisted_games: Array,
  canceled_games: Array,
  signup_time: Date,
})

const Settings = mongoose.model('Settings', SettingsSchema)

module.exports = Settings
