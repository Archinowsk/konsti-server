/* @flow */
import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    hiddenGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    canceledGames: Array,
    signupTime: Date,
  },
  { timestamps: true }
)

const Settings = mongoose.model('Settings', SettingsSchema)

export default Settings
