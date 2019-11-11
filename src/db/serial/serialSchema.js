// @flow
import mongoose from 'mongoose';

const SerialSchema = new mongoose.Schema({
  serial: String,
});

export const SerialModel = mongoose.model('Serial', SerialSchema);
