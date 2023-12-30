const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const approveStatus = require("../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const changeBookingDataSchema =
    new mongoose.Schema({
        agentId: {
            type: Schema.Types.ObjectId,
            ref: "userb2bs"
        },
        reason: {
            type: String
        },
        bookingId: {
            type: Number
        },
        hotelBookingId: {
            type: Schema.Types.ObjectId,
            ref: "hotelBookingDetail"
        },
        status: {
            type: String,
            default: "ACTIVE"
        },
        contactNumber: {
            type: String
        },
        changerequest: {
            type: String
        },
        amount: {
            type: Number
        },
        approveStatus: {
            type: String,
            enum: [approveStatus.APPROVED, approveStatus.REJECT, approveStatus.PENDING],
            default: approveStatus.PENDING
        }
    }, { timestamps: true }
    )
changeBookingDataSchema.plugin(mongoosePaginate);

changeBookingDataSchema.plugin(aggregatePaginate);

const changeBookingData = mongoose.model("changeHotelRequestData", changeBookingDataSchema);
module.exports = changeBookingData;