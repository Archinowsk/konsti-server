/* @flow */
import mongoose from 'mongoose'

const ResultsSchema = mongoose.Schema({
  result: Array,
  startTime: Date,
})

const Results = mongoose.model('Results', ResultsSchema)

export default Results
