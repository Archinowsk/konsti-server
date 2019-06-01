/* @flow */
import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  userGroup: String,
  serial: String,
  playerGroup: String,
  favoritedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  signedGames: [
    {
      gameDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
      priority: Number,
      time: Date,
    },
  ],
  enteredGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', UserSchema)

export default User
