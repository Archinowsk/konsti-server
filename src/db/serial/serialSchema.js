/* @flow */
import mongoose from 'mongoose'

const SerialSchema = new mongoose.Schema({
  serial: String,
})

const Serial = mongoose.model('Serial', SerialSchema)

export default Serial
