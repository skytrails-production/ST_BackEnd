const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require('../../enums/offerType');
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const promoBannerSchema = mongoose.Schema({
    images:{type:String},
    content:{type:String},
    url:{type:String},
    isClickAble:{type:Boolean},
    startDate:{type:String},
    endDate:{type:String},
    status:{type:String,default:status.ACTIVE}
},{timestamps:true});
promoBannerSchema.plugin(mongoosePaginate);

promoBannerSchema.plugin(aggregatePaginate);
const appPromotional = mongoose.model('appPromotionalBanner', promoBannerSchema);

module.exports = appPromotional;