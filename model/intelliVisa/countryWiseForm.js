const { Timestamp } = require('@google-cloud/firestore');
const mongoose = require('mongoose');

const countryWiseVisaFormSchema = new mongoose.Schema({
applicantId:{type:mongoose.Types.ObjectId,ref:'createIntellyVisaApply'},

}, { strict: false },{Timestamp:true});
const countryWiseModel = mongoose.model('visaFormCountryWise', countryWiseVisaFormSchema);
module.exports = countryWiseModel;