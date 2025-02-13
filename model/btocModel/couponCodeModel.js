const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const amountType = require("../../enums/amountType");


const discountValueSchema= new Schema({
  min: [{ type: Number, required: true }],
  max: [{ type: Number, required: true }]

});


const discountSchema = new Schema({
  name: {
    type: String,
    enum: [
      offerType.BUS,
      offerType.FLIGHTS,
      offerType.HOTELS,
      offerType.PACKAGES
    ]
  },
  value: discountValueSchema,
  limitAmount:Number,
  type: {
    type: String,
    enum: [amountType.AMOUNT, amountType.PERCENTAGE],
    required: true
  },
  class: {
    type: [String]
  }
});

const couponSchema = new Schema(
  {
    image: {
      type: String,
    },
    dashboardImg:{type:String},
    resultImage: {
        type: String
    },
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
    },
    discountPercentage:[discountSchema],
    limitAmount: {
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
    offerType: {
      type: String,
      enum: [
        offerType.BUS,
        offerType.FLIGHTS,
        offerType.BANKOFFERS,
        offerType.HOLIDAYS,
        offerType.HOTELS,
        offerType.FORALL,
        offerType.EVENTS,
        offerType.PACKAGES
      ],
    
    },
    userApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "userBtoC" }],
    applicableUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "userBtoC" }],
    whtDoUGet:[],
    howDoUGetit:[],
    elseNeedToKnow:[]
  },
  { timestamps: true }
);
couponSchema.plugin(mongoosePaginate);

couponSchema.plugin(aggregatePaginate);

const Coupon = mongoose.model("B2CCoupons", couponSchema);

module.exports = Coupon;
