/* @flow */
import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema(
  {
    hiddenGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    canceledGames: Array,
    signupTime: Date,
    appOpen: Boolean,
  },
  { timestamps: true }
)

export const Settings = mongoose.model('Settings', SettingsSchema)
