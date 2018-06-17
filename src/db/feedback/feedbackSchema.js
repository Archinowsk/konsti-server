/* @flow */
const mongoose = require('mongoose')

const FeedbackSchema = mongoose.Schema({
  game_id: Number,
  feedback: String,
  created: { type: Date, default: Date.now },
})

const Feedback = mongoose.model('Feedback', FeedbackSchema)

module.exports = Feedback
