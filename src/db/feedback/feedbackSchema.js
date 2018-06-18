/* @flow */
import mongoose from 'mongoose'

const FeedbackSchema = mongoose.Schema({
  game_id: Number,
  feedback: String,
  created: { type: Date, default: Date.now },
})

const Feedback = mongoose.model('Feedback', FeedbackSchema)

export default Feedback
