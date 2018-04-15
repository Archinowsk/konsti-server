const mongoose = require('mongoose')

const SettingsSchema = mongoose.Schema({
  game_id: Number,
  feedback: String,
  created: { type: Date, default: Date.now },
})

module.exports = SettingsSchema
