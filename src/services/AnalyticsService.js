const mongoose = require('mongoose');
const AnalyticsSchema = require('../models/Analytics');

const AnalyticsService = async trigger => {
  const { value } = await AnalyticsSchema.findById( trigger );
  await AnalyticsSchema.findOneAndUpdate({ _id: trigger}, { value: value+1 });
}

module.exports = AnalyticsService;
