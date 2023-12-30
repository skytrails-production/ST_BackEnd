const mongoose = require('mongoose');

const travelInsuranceSchema = new mongoose.Schema({
  policyNumber: { type: String, unique: true },
  policyHolder: String,
  tripStartDate: Date,
  tripEndDate: Date,
  coverageAmount: Number,
  premiumAmount: Number,
  destination: String,
  emergencyContact: String,
});

module.exports = mongoose.model('TravelInsurance', travelInsuranceSchema);
