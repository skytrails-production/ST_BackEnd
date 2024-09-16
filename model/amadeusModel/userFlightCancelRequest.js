const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
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
        flightBookingId: {
            type: Schema.Types.ObjectId,
            ref: "amadeusUserFlightBooking"
        },

        bookingId:{
            type: String,
        },
        pnr: {
            type: String,
        },
        amount:{
            type: Number,
        },
        status: {
            type: String,
            enum:[status.ACTIVE,status.BLOCK,status.DELETE],
            default: status.ACTIVE
        },
        bookingStatus: {
            type: String,
            enums: [bookingStatus.BOOKED, bookingStatus.CANCEL, bookingStatus.PENDING],
        },
        cancellationPartyType:{
            type: String,
            enums: ['TBO','AMADEUS'],
            default:"AMADEUS"
        }
    }, { timestamps: true }
)
cancelBookingDataSchema.plugin(mongoosePaginate);

cancelBookingDataSchema.plugin(aggregatePaginate);

const cancelBookingData = mongoose.model("userAmadeusCancelTickects", cancelBookingDataSchema);
module.exports = cancelBookingData;
