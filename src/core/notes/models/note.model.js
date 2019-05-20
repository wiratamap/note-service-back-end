const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  content: String,
  createdBy: { type: String, required: true, max: 50 },
  createdDate: { type: Date, default: Date.now() },
});

const Note = mongoose.model('Note', NoteSchema, 'note');

module.exports = { Note };
