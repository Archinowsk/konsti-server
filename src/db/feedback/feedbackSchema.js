// @flow
import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema(
  {
    gameId: String,
    feedback: String,
  },
  { timestamps: true }
)

export const Feedback = mongoose.model('Feedback', FeedbackSchema)
