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
        ref: "userBtoC",
    },
    amount: { 
        type: Number
     },
    paymentId:{
        type:String
    },
    easeBuzzPayId:{
        type:String,
    },
    orderId:{
        type:String
    },
    signature:{
        type:String
    },
    firstName:String,
    origin:String,
    destination:String,
    phone:Number,
    email:String,
    oneyWayDate:String,
    returnDate:String,
    bookingType: {
        type: String,
        enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS,offerType.EVENTS,offerType.RECHARGES,offerType.VISA],
    },
    transactionStatus: {
        type: String,
        enum: [paymentStatus.PENDING, paymentStatus.SUCCESS, paymentStatus.FAILED],
        default: paymentStatus.PENDING
    },
    isCRM:{type:Boolean,default:false}

}, { timestamps: true })

transactionSchema.plugin(aggregatePaginate);

transactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("userTransactions", transactionSchema);