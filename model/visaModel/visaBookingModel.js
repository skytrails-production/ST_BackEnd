const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);

const visaApplicationSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'visa',  // Reference to the Visa model
      required: true,
    },
    visaType: {
      type: String,
      required: true,
    },
    visaCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaCategory',  // Reference to the VisaCategory model
      required: true,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',  // Reference to the Document model
        required: true,
      },
    ],
    status: {
      type: String,
      default: "PENDING",
    },
    // Add other application-related fields as needed
  },
  { timestamps: true }
);
visaApplicationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("VisaApplication", visaApplicationSchema);
