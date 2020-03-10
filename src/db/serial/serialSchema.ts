import mongoose from 'mongoose';
import { Serial } from 'typings/serial.typings';

interface SerialDoc extends Serial, mongoose.Document {}

const SerialSchema = new mongoose.Schema({
  serial: String,
});

export const SerialModel = mongoose.model<SerialDoc>('Serial', SerialSchema);
