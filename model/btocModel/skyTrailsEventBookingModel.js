const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const bookEventSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "skyTrailsEvents",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "userTransactions",
    },
    price: { type: Number },
    eventDate: { type: String },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    
    tickets: [{ type: String }],
    isCoupanApplied: { type: Boolean, default: false },
    deviceToken: { type: String },
    deviceType: { type: String },
    isluckyUser: { type: Boolean, default: true },

    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    bookingStatus: {
      type: String,
      enum: [
        bookingStatus.BOOKED,
        bookingStatus.CANCEL,
        bookingStatus.FAILED,
        bookingStatus.PENDING,
      ],
      default: bookingStatus.PENDING,
    },
  },
  { timestamps: true }
);
bookEventSchema.plugin(mongoosePaginate);
bookEventSchema.plugin(aggregatePaginate);

const book = mongoose.model("userEventBookings", bookEventSchema);
module.exports = book;
