/* @flow */
import mongoose from 'mongoose'

const ResultsSchema = new mongoose.Schema(
  {
    result: [
      {
        username: String,
        enteredGame: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
        signedGames: [
          {
            gameDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
            priority: Number,
            time: Date,
          },
        ],
      },
    ],
    startTime: Date,
  },
  { timestamps: true }
)

const Results = mongoose.model('Results', ResultsSchema)

export default Results
