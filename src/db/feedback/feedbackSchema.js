/* @flow */
import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema(
  {
    gameId: String,
    feedback: String,
  },
  { timestamps: true }
)

const Feedback = mongoose.model('Feedback', FeedbackSchema)

export default Feedback
