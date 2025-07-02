const mongoose = require("mongoose");
const offerType = require("../../enums/offerType");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const paymentStatus = require("../../enums/paymentStatus");
mongoose.pluralize(null);

const createVisaApplySchema = new mongoose.Schema(
  {
    userId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
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
    fee: { processingFee: { type: String,default:"999" }, platformFee: { type: String,default:"100" } },
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
      enum: [
        offerType.FLIGHTS,
        offerType.HOTELS,
        offerType.BUS,
        offerType.VISA,
      ],
      default: offerType.VISA,
    },
    sessionCredential: {
      applicantUid: { type: String },
      bearerToken: { type: String },
      visaCategory: { type: String },
      fromDate: { type: String },
      toDate: { type: String },
      sourceCountry: { type: String },
      destinationCountry: { type: String },
      applicationCreationKey: { type: String },
    },
    agentDetails: {
      agentName: { type: String },
      agentId: { type: String },
      contactNumber: { type: String },
    },
    redirectUrl: { type: String },
    guideLines: [],
    isgovProgress: { type: Boolean, default: false },
   
    
  },
  { timestamps: true }
);

const visaHistory = mongoose.model(
  "createIntellyVisaApply",
  createVisaApplySchema
);
module.exports = visaHistory;
