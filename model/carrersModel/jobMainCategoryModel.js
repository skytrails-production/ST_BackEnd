const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const status=require ('../../enums/status')
mongoose.pluralize(null);


const categorySchema = new mongoose.Schema({
    categoryName: String,
    description: String,
    status: {type:String,enum:[status.ACTIVE,status.BLOCK,status.DELETE],default:status.ACTIVE},
}, { timestamps: true });

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(aggregatePaginate);
module.exports = mongoose.model('jobCategories', categorySchema);
