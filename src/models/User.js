const { Schema, model } = require('mongoose');
const { EN } = require('../constants/Languages');
const { USER, ADMIN } = require('../constants/Roles');

const User = new Schema({
  _id: { type: Number, unique: true },
  lang: { type: String, default: EN },
  role: { type: String, default: USER },
})

module.exports = model('User', User);
