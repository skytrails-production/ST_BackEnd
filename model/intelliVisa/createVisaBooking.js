const mongoose = require("mongoose");
const offerType = require("../../enums/offerType");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const paymentStatus=require("../../enums/paymentStatus")
mongoose.pluralize(null);

const createVisaApplySchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  sex: { type: String },
  mobileNumber: { phone: { type: String } },
  address: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pin: { type: String },
  },
  dateOfBirth: { type: Date },
  passport_Details: {
    passportNumber: { type: String },
    passportIssueDate: { type: Date },
    passportExpiryDate: { type: Date },
  },
  depCountyName: { type: String },
  arrCountyName: { type: String },
  fromDate: { type: String },
  toDate: { type: String },
  visaType: { type: String },
  fee: { processingFee: { type: String }, platformFee: { type: String } },
  paymentStatus: {
    type: String,
    enum: [
      paymentStatus.SUCCESS,
      paymentStatus.FAILED,
      paymentStatus.PENDING,
    ],
    default: paymentStatus.PENDING,
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
  status: {
    type: String,
    enum: [status.ACTIVE, status.BLOCK, status.DELETE],
    default: status.ACTIVE,
  },
  transactionId: {
    type: mongoose.Types.ObjectId,
    ref: "userTransactions",
  },
  visaCountryId: {
    type: mongoose.Types.ObjectId,
    ref: "IntellyCountryVisa",
  },
  bookingType: {
    type: String,
    enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS, offerType.VISA],
    default: offerType.VISA,
  },
});

const visaHistory = mongoose.model("createVisaApply", createVisaApplySchema);
module.exports = visaHistory;
