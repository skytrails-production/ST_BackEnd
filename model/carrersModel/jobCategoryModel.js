const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const status=require ('../../enums/status')
mongoose.pluralize(null);


const careerSchema = new mongoose.Schema({
    categoryName: String,
    description: String,
    status: {type:String,enum:[status.ACTIVE,status.BLOCK,status.DELETE],default:status.ACTIVE},
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'skyJobCategories' },
}, { timestamps: true })
careerSchema.plugin(mongoosePaginate);
careerSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('skyJobCategories', careerSchema);