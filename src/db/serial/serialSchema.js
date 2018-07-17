/* @flow */
import mongoose from 'mongoose'

const SerialSchema = mongoose.Schema({
  serial: String,
})

const Serial = mongoose.model('Serial', SerialSchema)

export default Serial
