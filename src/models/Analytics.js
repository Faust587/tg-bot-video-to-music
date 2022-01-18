const { Schema, model } = require('mongoose')

const Analytics = new Schema({
  _id: { type: String, unique: true },
  value: { type: Number },
})

module.exports = model('Analytics', Analytics);
