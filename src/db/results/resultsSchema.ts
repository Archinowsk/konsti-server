import mongoose from 'mongoose';
import { Result } from 'typings/result.typings';

interface ResultDoc extends Result, mongoose.Document {
  algorithm: string;
  message: string;
}

const ResultsSchema = new mongoose.Schema(
  {
    results: [
      {
        username: String,
        enteredGame: {
          gameDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
          priority: Number,
          time: Date,
        },
      },
    ],
    startTime: Date,
    algorithm: String,
    message: String,
  },
  { timestamps: true }
);

export const ResultsModel = mongoose.model<ResultDoc>('Results', ResultsSchema);
