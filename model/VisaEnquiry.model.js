const mongoose = require("mongoose");

// Define a VisaEnquiry schema
const visaEnquirySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    passportNumber: {
      type: String,
      required: true,
    },
    visaCountry: {
      type: String,
      required: true,
    },
    visaCategory: {
      type: String,
      required: true,
    },
    visaSubcategory: {
      type: String,
      required: true,
    },
    visaType: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    Source: {
      type: String,
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a VisaEnquiry model based on the schema
const VisaEnquiry = mongoose.model("VisaEnquiry", visaEnquirySchema);

module.exports = VisaEnquiry;
