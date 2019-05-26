/* @flow */
import mongoose from 'mongoose'

const SettingsSchema = mongoose.Schema({
  hiddenGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  canceledGames: Array,
  signupTime: Date,
})

const Settings = mongoose.model('Settings', SettingsSchema)

export default Settings
