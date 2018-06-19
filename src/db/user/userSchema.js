/* @flow */
import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  userGroup: String,
  serial: String,
  playerGroup: Number,
  favoritedGames: [{}],
  signedGames: [{}],
  enteredGames: [{}],
  created: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

export default User
