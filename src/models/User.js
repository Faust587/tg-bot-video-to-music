const { Schema, model } = require('mongoose');
const { EN } = require('../constants/Languages');
const { USER } = require('../constants/Roles');

const UserSchema = new Schema({
  userId: { type: Number, unique: true },
  lang: { type: String, default: EN },
  role: { type: String, default: USER },
})

module.exports = model('User', UserSchema);
