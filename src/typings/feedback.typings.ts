import mongoose from 'mongoose';
import { Record, String, Static } from 'runtypes';

export interface FeedbackDoc extends Feedback, mongoose.Document {}

export type Feedback = Static<typeof FeedbackRuntype>;

export const FeedbackRuntype = Record({
  gameId: String,
  feedback: String,
});
