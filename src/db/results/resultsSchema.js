// @flow
import mongoose from 'mongoose';

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

export const ResultsModel = mongoose.model('Results', ResultsSchema);
