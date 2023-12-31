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
        busId: {
            type: Number
        },
        busBookingId: {
            type: Schema.Types.ObjectId,
            ref: "busBookingData"
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

const changeBookingData = mongoose.model("changeBusRequestData", changeBookingDataSchema);
module.exports = changeBookingData;