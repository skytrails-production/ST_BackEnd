const mongoose = require('mongoose');
mongoose.pluralize(null);

const countryVisaSchema = new mongoose.Schema({
  country: { type: String},
  code: { type: String},
  alpha3Code: { type: String},
  visaCategories: [{ type: String}]
},{ timestamps: true });

const CountryVisa = mongoose.model('IntellyCountryVisa', countryVisaSchema);
module.exports = CountryVisa;

