const mongoose = require('mongoose')

const ResultsSchema = mongoose.Schema({
  result: Array,
  time: Date,
})

module.exports = ResultsSchema
