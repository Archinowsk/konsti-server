import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    gameId: String,
    feedback: String,
  },
  { timestamps: true }
);

export const FeedbackModel = mongoose.model('Feedback', feedbackSchema);
