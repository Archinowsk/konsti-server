/* @flow */
import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
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
  englishOk: Boolean,
  childrenFriendly: Boolean,
  ageRestricted: Boolean,
  beginnerFriendly: Boolean,
  intendedForExperiencedParticipants: Boolean,
  shortDescription: String,
  revolvingDoor: Boolean,
  popularity: { type: Number, default: 0 },
})

export const Game = mongoose.model('Game', GameSchema)
