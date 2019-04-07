/* @flow */
import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  userGroup: String,
  serial: String,
  playerGroup: String,
  favoritedGames: [{ gameId: String }],
  signedGames: [{ gameId: String, priority: Number, time: Date }],
  enteredGames: [{ gameId: String }],
  created: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

export default User
