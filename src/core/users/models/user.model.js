const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, max: 40 },
  email: String,
  password: String,
  createdDate: { type: Date, default: Date.now() },
});

const User = mongoose.model('User', UserSchema, 'user');

module.exports = { User };
