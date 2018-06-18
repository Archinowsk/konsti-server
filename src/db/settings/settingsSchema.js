/* @flow */
import mongoose from 'mongoose'

const SettingsSchema = mongoose.Schema({
  blacklisted_games: Array,
  canceled_games: Array,
  signup_time: Date,
})

const Settings = mongoose.model('Settings', SettingsSchema)

export default Settings
