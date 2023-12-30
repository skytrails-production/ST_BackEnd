const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require('../../enums/offerType');
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const { timeStamp } = require("console");

const advertisementSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    remainingDays: {
        type: Number,
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
    },
    addType:{
        type: String,
        enum:[offerType.FLIGHTS,offerType.BUS,offerType.HOTELS,offerType.HOLIDAYS],
        default:offerType.FLIGHTS
    }
},{timeStamp:true})
advertisementSchema.plugin(mongoosePaginate);

advertisementSchema.plugin(aggregatePaginate);
const Advertisement = mongoose.model('flightAdvertisement', advertisementSchema);

module.exports = Advertisement;