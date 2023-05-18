const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  days: [{
    day: { type: String, required: true },
    place: { type: String, required: true },
    description: { type: String, required: true },
  }]
});

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = TravelPlan;
