/* @flow */
import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  userGroup: String,
  serial: String,
  playerGroup: String,
  favoritedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  signedGames: [{ gameId: String, priority: Number, time: Date }],
  enteredGames: [{ gameId: String }],
  created: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

export default User
