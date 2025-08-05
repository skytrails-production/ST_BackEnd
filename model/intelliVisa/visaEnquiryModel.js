const mongoose = require("mongoose");
mongoose.pluralize(null);

const visaApplicationEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    visaType: {
      type: String,
    },
    country: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    terms_accepted: {
      type: Boolean,
      validate: {
        validator: (val) => val === true,
        message: "Terms must be accepted.",
      },
    },
    source: {
      type: String,
      enum: ["website_form", "mobile_app", "referral", "other"],
      default: "website_form",
    },
  },
  {
    timestamps: true,}
);

const CountryVisa = mongoose.model(
  "visaEnquiryNew",
  visaApplicationEnquirySchema
);
module.exports = CountryVisa;
