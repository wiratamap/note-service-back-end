const { Note } = require('../models/note.model');

const fetchAll = async () => Note.find({});

const create = async (note) => {
  const updatedNote = { ...note };
  updatedNote.createdBy = 'SYSTEM';

  return Note.create(updatedNote);
};

module.exports = { fetchAll, create };
