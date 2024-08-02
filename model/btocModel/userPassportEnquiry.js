const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const resolveStatus = require("../../enums/errorType");
const applyType = require("../../enums/passportEnquiryType");
// const visaType = require("../../enums/visaType");
const genderType = require("../../enums/gender");
mongoose.pluralize(null);
const passportEnquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    passportNumber:{
      type: String,
    },
    issuedDate:{
      type: String,
    },
    expiryDate:{
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: [genderType.FEMALE, genderType.MALE, genderType.OTHER],
    },
    dob: {
      type: String,
    },
    age: {
      type: String,
    },
    document: [
      {
        type: String,
      },
    ],
    type: { type: String, enum: [applyType.CREATE, applyType.RENEW] },
    resolveStatus: {
      type: String,
      enum: [resolveStatus.PENDING, resolveStatus.RESOLVED],
      default: resolveStatus.PENDING,
    },
    status: {
      type: String,
      default: status.ACTIVE,
    },
    via:{type:String,default:'USER'}
  },
  { timestamps: true }
);
passportEnquirySchema.plugin(mongoosePaginate);
passportEnquirySchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userPassportEnquiry", passportEnquirySchema);
