const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);
const visaSchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
    },
    price: {
      type: Number,
    },
    validityPeriod: {
      type: String,
    },
    lengthOfStay: {
      type: String,
    },
    gallery: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      default: status.ACTIVE,
    },
    issuedType: {
      type: String,
      enum: [issuedType.MONTHLY_VISA, issuedType.NO_VISA, issuedType.WEEKLY_VISA,issuedType.VISA_ON_ARRIVAL],
    },
    visaType: {
      type: String,
    },
    governmentFees: {
      type: Number,
    },
    platFormFees: {
      type: Number,
    },
    daysToProcess: {
      type: Number,
      default:10
    },
    continent:{
      type:String
    }
  },
  { timestamps: true }
);
visaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("visa", visaSchema);