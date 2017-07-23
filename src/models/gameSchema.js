const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  notes: String,
  location: String,
  date: Date,
  time: String,
  mins: Number,
  tags: Array,
  people: Array,
  min_attendance: Number,
  max_attendance: Number,
  attributes: Array,
  table: String,
  updated_at: { type: Date, default: Date.now },
});

// On every save, add the date
GameSchema.pre('save', next => {
  // Change the updated_at field to current date
  this.updated_at = new Date();
  next();
});

module.exports = GameSchema;
