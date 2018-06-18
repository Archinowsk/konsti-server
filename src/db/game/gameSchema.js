/* @flow */
import mongoose from 'mongoose'

const GameSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  notes: String,
  location: String,
  date: Date,
  time: String,
  mins: Number,
  tags: Array,
  people: Array,
  min_attendance: Number,
  max_attendance: Number,
  attributes: Array,
  table: String,
  created: { type: Date, default: Date.now },
})

const Game = mongoose.model('Game', GameSchema)

export default Game
