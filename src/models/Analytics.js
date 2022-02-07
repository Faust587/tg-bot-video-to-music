const { Schema, model } = require('mongoose')

const Analytics = new Schema({
  type: { type: String, unique: true },
  value: { type: Number },
})

module.exports = model('Analytics', Analytics);
