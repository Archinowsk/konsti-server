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
  minAttendance: Number,
  maxAttendance: Number,
  attributes: Array,
  table: String,
  // $FlowFixMe
  created: { type: Date, default: Date.now },
})

const Game = mongoose.model('Game', GameSchema)

export default Game
