const { Timestamp } = require('@google-cloud/firestore');
const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema({
applicantId:{type:mongoose.Types.ObjectId,ref:'createIntellyVisaApply'},
}, { strict: false },{timeStamp:true});
const DynamicModel = mongoose.model('countryWiseVisaApplications', dynamicSchema);
module.exports = DynamicModel;