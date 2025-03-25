const mongoose = require('mongoose');
mongoose.pluralize(null);

const createVisaApplySchema = new mongoose.Schema({
  country: { type: String},
  code: { type: String},
  alpha3Code: { type: String},
  visaCategories: [{ type: String}]
});

const visaHistor = mongoose.model('createVisaApply', createVisaApplySchema);
module.exports = visaHistor;

