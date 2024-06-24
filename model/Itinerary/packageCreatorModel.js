const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const packageCreatorSchema = new mongoose.Schema(
  {
    userName: { type: String },
    email: { type: String },
    password: { type: String },
    phone: {
      countryCode: {
        type: String,
        default: "+91",
      },
      mobileNumber: { type: String },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dob: {
      type: String,
    },
    socialId: {
      type: String,
    },
    socialType: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: [gender.FEMALE, gender.MALE, gender.OTHER],
    },
    Nationality: {
      type: String,
    },
    City: {
      type: String,
    },
    State: {
      type: String,
    },
    pincode: {
      type: String,
    },
    approveStatus: {
      type: String,
      enum: [
        approveStatus.APPROVED,
        approveStatus.PENDING,
        approveStatus.REJECT,
      ],
      default: approveStatus.PENDING,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    reason: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
    },
    otpExpireTime: {
      type: Date,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    fcmToken: {
      type: [],
      _id: false,
      default: [],
    },
    deviceToken: {
      type: String,
      default: "",
    },
    deviceType: { type: String },
    balance: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    uniqueId: {
      type: String,
    },
  },
  { timestamps: true }
);
packageCreatorSchema.plugin(mongoosePaginate);
packageCreatorSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("packageCreators", packageCreatorSchema);
