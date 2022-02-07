require('mongoose');
const AnalyticsSchema = require('../models/Analytics');

const AnalyticsService = async trigger => {
  const { value } = await AnalyticsSchema.findOne( { type: trigger } );
  await AnalyticsSchema.findOneAndUpdate({ type: trigger}, { value: value+1 });
}

module.exports = AnalyticsService;
