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

const transactionSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    amount: { 
        type: Number
     },
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    signature:{
        type:String
    },
    bookingType: {
        type: String,
        enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
    },
    transactionStatus: {
        type: String,
        enum: [paymentStatus.PENDING, paymentStatus.SUCCESS, paymentStatus.FAILED],
        default: paymentStatus.PENDING
    }

}, { timestamps: true })

transactionSchema.plugin(aggregatePaginate);

transactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("userTransactions", transactionSchema);