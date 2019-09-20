// @flow
import mongoose from 'mongoose'

const SerialSchema = new mongoose.Schema({
  serial: String,
})

export const Serial = mongoose.model('Serial', SerialSchema)
