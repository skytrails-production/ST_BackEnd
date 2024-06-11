const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);

const userGrnCancelSchema=new mongoose.Schema( {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userBtoC",
    },
    reason: {
        type: String
    },
    hotelBookingId: {
        type: Schema.Types.ObjectId,
        ref: "userGRNHotelBooking"
    },
    bookingId: {
        type: String,
    },
    bookingReference: {
        type: String,
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
},{ timestamps: true });

userGrnCancelSchema.plugin(mongoosePaginate);

userGrnCancelSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userGrnCancel", userGrnCancelSchema);