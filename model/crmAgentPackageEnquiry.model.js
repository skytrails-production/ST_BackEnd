const mongoose = require("mongoose");
const status =require("../enums/status");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const crmAgentPackageEnquirySchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkyTrailsPackages",
    },
    userId: String,
    email: {
      type: String,
    },
    fullName: {
      type: String,
    },
    contactNumber: {
      countryCode: {
        type: String,
        default: "+91",
      },
      phone: {
        type: String,
      },
    },
    departureCity: {
      type: String,
    },
    adults: {
      type: Number,
    },
    child: {
      type: Number,
    },
    packageType: {
      type: String,
    },
    departureDate: {
      type: String,
    },
    connected: {
      type: Boolean,
      default: false,
    },
    noOfPeople:{
      type: Number,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);



crmAgentPackageEnquirySchema.plugin(mongoosePaginate);
crmAgentPackageEnquirySchema.plugin(aggregatePaginate);

const CrmAgentPackageEnquiry = mongoose.model(
  "CrmAgentPackageEnquiry",
  crmAgentPackageEnquirySchema
);

module.exports = CrmAgentPackageEnquiry;