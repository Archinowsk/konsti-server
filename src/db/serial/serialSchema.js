/* @flow */
import mongoose from 'mongoose'

const SerialSchema = mongoose.Schema({
  // $FlowFixMe
  serial: { type: String, unique: true },
})

const Serial = mongoose.model('Serial', SerialSchema)

export default Serial
