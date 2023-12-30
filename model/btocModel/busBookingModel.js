const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const BookingDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    destination: {
      type: String,
    },
    origin: {
      type: String,
    },
    departureTime: {
      type: String,
    },
    arrivalTime: String,
    travelName: String,
    busType: {
      type: String,
    },
    pnr: {
      type: String,
    },
    busId: {
      type: Number,
    },
    noOfSeats: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      default: status.ACTIVE,
    },
    bookingStatus: {
      type: String,
      default: bookingStatus.BOOKED
    },
    passenger: [
      {
        title: String,
        firstName: String,
        lastName: String,
        Email: String,
        Phone: String,
        Address: String,
        seatNumber: String,
        Price: Number,
      },
    ],
    BoardingPoint: {
      Location: String,
      Landmark: String,
      Address: String,
      Contactnumber: String,
    },
    CancelPolicy: [
      {
        CancellationCharge: Number,
        CancellationChargeType: Number,
        PolicyString: String,
        TimeBeforeDept: String,
        FromDate: String,
        ToDate: String,
      },
    ],
    transactions: {
      type: mongoose.Types.ObjectId,
      ref: "transactions",
    },
    bookingType: {
      type: String,
      enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
      default: offerType.BUS,
    },
  },
  { timestamps: true }
);
BookingDetailSchema.plugin(mongoosePaginate);

BookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userbusBookingDetail", BookingDetailSchema);
