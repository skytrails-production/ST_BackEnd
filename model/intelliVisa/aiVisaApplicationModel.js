const mongoose = require("mongoose");
const offerType = require("../../enums/offerType");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const paymentStatus = require("../../enums/paymentStatus");
const { Timestamp } = require("@google-cloud/firestore");
mongoose.pluralize(null);

const aiIntellyVisaApplySchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Types.ObjectId,
      ref: "createIntellyVisaApply",
    },
    userId: { type: String },
    applicantEmail: { type: String },
    applicantName: { type: String },
    passportNumber: { type: String },
    visaType: { type: String },
    visaCategory: { type: String },
    destinationCountry: { type: String },
    travelDates: {
      from: { type: Date },
      to: { type: Date },
    },
    durationDays: { type: Number },
    applicationStatus: { type: String, default: "Pending" },
    documents: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    appointmentDetails: {
      govSubmissionCompleted: { type: Boolean },
      appointmentBooked: { type: Boolean },
      biometricsCaptured: { type: Boolean },
    },
    tracking: {
      emailUpdatesEnabled: { type: Boolean },
      smsUpdatesEnabled: { type: Boolean },
    },
    passportCollection: {
      receiptAvailable: { type: Boolean },
      idProofSubmitted: { type: Boolean },
    },
  },
  { timestamps: true }
);

const visaHistory = mongoose.model(
  "aiIntellyVisaApplications",
  aiIntellyVisaApplySchema
);
module.exports = visaHistory;
