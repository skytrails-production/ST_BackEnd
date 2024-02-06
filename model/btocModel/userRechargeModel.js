const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
const paymentStatus = require("../../enums/paymentStatus");

mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const rechargeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userBtoC",
    },
    amount: { 
        type: Number
     },
    mobileOperator:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    paymentId:{
        type:String
    },
    easeBuzzPayId:{
        type:String
    },
    bookingType: {
        type: String,
        // enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS,offerType.EVENTS],
    },
    // transactionStatus: {
    //     type: String,
    //     enum: [paymentStatus.PENDING, paymentStatus.SUCCESS, paymentStatus.FAILED],
    //     default: paymentStatus.SUCCESS
    // }

}, { timestamps: true })

rechargeSchema.plugin(aggregatePaginate);

rechargeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("userRecharges", rechargeSchema);