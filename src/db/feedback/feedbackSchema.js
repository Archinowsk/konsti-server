/* @flow */
import mongoose from 'mongoose'

const FeedbackSchema = mongoose.Schema({
  gameId: String,
  feedback: String,
  // $FlowFixMe
  created: { type: Date, default: Date.now },
})

const Feedback = mongoose.model('Feedback', FeedbackSchema)

export default Feedback
