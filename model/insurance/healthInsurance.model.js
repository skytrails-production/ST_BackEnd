const mongoose = require('mongoose');

const healthInsuranceSchema = new mongoose.Schema({
  policyNumber: { type: String, unique: true },
  policyHolder: String,
  effectiveDate: Date,
  expirationDate: Date,
  coverageType: String,
  premiumAmount: Number,
  coveredServices: [String],
  coPayAmount: Number,
  deductible: Number,
  primaryCarePhysician: String,
});

module.exports = mongoose.model('HealthInsurance', healthInsuranceSchema);
