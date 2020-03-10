import mongoose from 'mongoose';
import { Feedback } from 'typings/feedback.typings';

interface FeedbackDoc extends Feedback, mongoose.Document {}

const feedbackSchema = new mongoose.Schema(
  {
    gameId: String,
    feedback: String,
  },
  { timestamps: true }
);

export const FeedbackModel = mongoose.model<FeedbackDoc>(
  'Feedback',
  feedbackSchema
);
