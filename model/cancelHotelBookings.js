const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const cancelBookingDataSchema =
    new mongoose.Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userb2bs"
        },
        reason: {
            type: String
        },
        hotelBookingId: {
            type: Schema.Types.ObjectId,
            ref: "hotelBookingDetail"
        },
        bookingId:{
            type: Number,
        },
        pnr: {
            type: String,
        },
        status: {
            type: String,
            default: "ACTIVE"
        },
        bookingStatus: {
            type: String,
            enums: [bookingStatus.BOOKED, bookingStatus.CANCEL, bookingStatus.PENDING],
        },
    }, { timestamps: true }
    )
cancelBookingDataSchema.plugin(mongoosePaginate);

cancelBookingDataSchema.plugin(aggregatePaginate);

const cancelBookingData = mongoose.model("agentCancelHotelTicket", cancelBookingDataSchema);
module.exports = cancelBookingData;
