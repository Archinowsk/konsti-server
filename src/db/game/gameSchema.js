/* @flow */
import mongoose from 'mongoose'

const GameSchema = mongoose.Schema({
  gameId: String,
  title: String,
  description: String,
  location: String,
  startTime: Date,
  mins: Number,
  tags: Array,
  genres: Array,
  styles: Array,
  language: String,
  endTime: Date,
  people: String,
  minAttendance: Number,
  maxAttendance: Number,
  gameSystem: String,
  noLanguage: Boolean,
  englishOk: Boolean,
  childrenFriendly: Boolean,
  ageRestricted: Boolean,
  beginnerFriendly: Boolean,
  intendedForExperiencedParticipants: Boolean,
})

const Game = mongoose.model('Game', GameSchema)

export default Game
