import mongoose from 'mongoose';

export interface FeedbackDoc extends Feedback, mongoose.Document {}

export interface Feedback {
  gameId: string;
  feedback: string;
}
