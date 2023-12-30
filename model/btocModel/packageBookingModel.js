const mongoose = require("mongoose");
const status = require("../../enums/status");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const packageBookingSchema = new mongoose.Schema(
  {
    pakageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "internationl",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    contactNumber: {
      contryCode: {
        type: String,
        default: "+91",
      },
      phone: {
        type: String,
      },
    },
    departureCity: {
      type: String,
    },
    adults: {
      type: Number,
    },
    child: {
      type: Number,
    },
    selectRoom: {
      type: Number,
    },
    checkIndate: {
      type: String,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);
packageBookingSchema.plugin(mongoosePaginate);

packageBookingSchema.plugin(aggregatePaginate);
const package = mongoose.model("userPackageBooking", packageBookingSchema);

module.exports = package;
