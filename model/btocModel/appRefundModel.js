const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const offerType = require("../../enums/offerType");
const paymentStatus = require("../../enums/paymentStatus");

mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const refundSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userBtoC",
    },
    amount: { 
        type: Number
     },
    refundId:{
        type:String
    },
    orderId:{
        type:String
    },
    refundSpeed:{
        type:String,
        enum:['STANDARD','INSTANT']
    },
    refundNote:{
        type:String
    },
    refundCurrency:{
        type:String
    },
    bookingType: {
        type: String,
        enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS,offerType.EVENTS,offerType.RECHARGES],
    },
    refundStatus: {
        type: String,
        enum: [paymentStatus.PENDING, paymentStatus.SUCCESS, paymentStatus.FAILED],
        default: paymentStatus.PENDING
    }

}, { timestamps: true })

refundSchema.plugin(aggregatePaginate);

refundSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("appRefund", refundSchema);