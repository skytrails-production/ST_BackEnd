const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const approveStatus = require("../../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const cancelBookingDataSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userBtoC",
        },
        reason: {
            type: String
        },
        hotelBookingId: {
            type: Schema.Types.ObjectId,
            ref: "userHotelBookingDetail"
        },
        bookingId: {
            type: Number,
        },
        pnr: {
            type: String,
        },
        status: {
            type: String,
            enum:[status.ACTIVE,status.BLOCK,status.DELETE],
            default: status.ACTIVE
        },
        processStatus: {
            type: String,
            enums: [approveStatus.APPROVED, approveStatus.REJECT, approveStatus.PENDING],
            default:approveStatus.PENDING
            
        },
    }, { timestamps: true }
)
cancelBookingDataSchema.plugin(mongoosePaginate);

cancelBookingDataSchema.plugin(aggregatePaginate);

const cancelBookingData = mongoose.model("userCancelHotelTickects", cancelBookingDataSchema);
module.exports = cancelBookingData;
