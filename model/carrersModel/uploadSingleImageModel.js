const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const status=require ('../../enums/status')
mongoose.pluralize(null);


const uploadDocument = new mongoose.Schema({
    document: String,
}, { timestamps: true })
uploadDocument.plugin(mongoosePaginate);
uploadDocument.plugin(aggregatePaginate);
module.exports = mongoose.model('uploadDocuments', uploadDocument);