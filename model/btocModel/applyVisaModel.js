const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require('../../enums/offerType');
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const visaApplicationSchema = new mongoose.Schema({
    currentAddress:{
       StreetAddress: {
        type: String
    },
    City: {
        type: String,
    },
    State: {
        type: String,
    },
    PinCode: {
        type: Date,
    }, 
    },
    pickUpAddress:{
        houseNo:{type: String},
        roadName:{type: String},
        landMark:{type: String},
        city:{type: String},
        state:{type: String},
        pincode:{type: String},
    },
    image:{
        type:String
    },
    passposrtImage:{
        type:String
    },
    pickupDate:{
        type:String
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default:status.ACTIVE,
    },
    approvalStatus:{
        type: String,
        enum:[approvalStatus.APPROVED, approvalStatus.PENDING,approvalStatus.REJECT],
        default:approvalStatus.APPROVED,
    }
},{timestamps:true})
visaApplicationSchema.plugin(mongoosePaginate);

visaApplicationSchema.plugin(aggregatePaginate);
const visaApplication = mongoose.model('visaApplication', visaApplicationSchema);

module.exports = visaApplication;