const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const couponSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    remainingDays: {
      type: Number,
    },
    couponCode: {
      type: String,
      unique: true,
    },
    discountPercentage: {
      type: Number,
    },
    limitAmount:{
        type: Number,
    },
    expirationDate: {
      type: Date,
    },
    termsAndCond:[],
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    approvalStatus: {
      type: String,
      enum: [
        approvalStatus.APPROVED,
        approvalStatus.PENDING,
        approvalStatus.REJECT,
      ],
      default: approvalStatus.APPROVED,
    },
    addType: {
      type: String,
      enum: [
        offerType.BUS,
        offerType.FLIGHTS,
        offerType.BANKOFFERS,
        offerType.HOLIDAYS,
        offerType.HOTELS,
      ],
    },
  },
  { timestamps: true }
);
couponSchema.plugin(mongoosePaginate);

couponSchema.plugin(aggregatePaginate);

const Coupon = mongoose.model('Coupons', couponSchema);

module.exports = Coupon;
