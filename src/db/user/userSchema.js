/* @flow */
import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  userGroup: String,
  serial: String,
  playerGroup: String,
  favoritedGames: [{ id: String }],
  signedGames: [{ id: String, priority: Number, time: Date }],
  enteredGames: [{ id: String }],
  created: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

export default User
