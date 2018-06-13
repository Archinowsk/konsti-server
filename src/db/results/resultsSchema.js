const mongoose = require('mongoose')

const ResultsSchema = mongoose.Schema({
  result: Array,
  time: Date,
})

const Results = mongoose.model('Results', ResultsSchema)

module.exports = Results
