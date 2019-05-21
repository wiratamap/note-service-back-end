const { Note } = require('../models/note.model');

const fetchAll = async userInformation => Note.find({ createdBy: userInformation.email });

const create = async (note, userInformation) => {
  const updatedNote = { ...note };
  updatedNote.createdBy = userInformation.email;

  return Note.create(updatedNote);
};

module.exports = { fetchAll, create };
