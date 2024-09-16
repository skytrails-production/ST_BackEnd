const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const searchType = require("../../enums/offerType");
const gender=require("../../enums/gender");
const userType=require("../../enums/userType")
const approveStatus = require("../../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const mihuruPaymentType=require("../../enums/MihuruPaymentType")
const { number } = require("joi");
mongoose.pluralize(null);




const usersSchema = new Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    phone: {
      country_code: {
        type: String,
        default: "+91",
      },
    mobile_number: { type: String },
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
    isOnline: {
      type: Boolean,
      default: false,
    },
    isSocial: {
      type: Boolean,
      default: false,
    },
    firstTime: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    gender:{
      type: String,
      enum:[gender.FEMALE,gender.MALE,gender.OTHER]
    },
    Nationality:{
      type: String,
    },
    City:{
      type: String
    },
    State:{
      type: String
    },
    pincode:{
      type:String
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
    userType: {
      type: String,
      enum: [userType.ADMIN, userType.AGENT, userType.USER, userType.SUBADMIN],
      default: userType.USER,
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
    deviceToken:{
      type: String,
      default: "",
    },
    deviceTokens:{ type: [String], default: [] }, 
    deviceType:{type: String},
    balance: {
      type: Number,
      default:0
    },
    mihuruWallet:{
      paymentId: {
        type: String,
        default: "Sky",
      },
      paymentReferenceId: {
        type: String,
        default: "Sky",
      },
      paymentAmount: {
        type: Number,
        default: 0,
      },
      availableLimit: {
        type: Number,
        default: 0,
      },
      remark: {
        type: String,
        default: "check down payment",
      },
      status: {
        type: String,
        enum: [mihuruPaymentType.PAYMENTCOMP,mihuruPaymentType.PAYMENTFAILED,mihuruPaymentType.PAYMENTREJECT,mihuruPaymentType.PAYMENTUNCHECK],
        default:mihuruPaymentType.PAYMENTUNCHECK,
      }},
    bio: {
      type: String,
      default: "",
    },
    coverPic: {
      type: String,
      default: "",
    },
    referralCode: {type:String}, // Add referral code field
    referrerCode: {type:String},
    referredBy:{type: Schema.Types.ObjectId, ref: 'userBtoC'},
    walletHistory: [{
      _id: false,
      amount: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    transactionType: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }}], // Array of wallet history objects
  },
  {
    timestamps: true,
  }
);
usersSchema.plugin(mongoosePaginate);
usersSchema.plugin(aggregatePaginate);
usersSchema.index({ location: "2dsphere" });

const User = mongoose.model("userBtoC", usersSchema);
module.exports = User;