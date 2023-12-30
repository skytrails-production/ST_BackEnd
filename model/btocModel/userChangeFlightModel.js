const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const approveStatus = require("../../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const changeBookingDataSchema =
    new mongoose.Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        reason: {
            type: String
        },
        bookingId: {
            type: Number
        },
        flightBookingId: {
            type: Schema.Types.ObjectId,
            ref: "userflightBookingDetail"
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
        status: {
            type: String,
            enum:[status.ACTIVE,status.BLOCK,status.DELETE],
            default: status.ACTIVE
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

const changeBookingData = mongoose.model("userChangeFlightRequest", changeBookingDataSchema);
module.exports = changeBookingData;