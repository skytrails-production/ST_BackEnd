const mongoose = require("mongoose");
const bookingStatus = require("../../enums/bookingStatus");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const issuedType = require("../../enums/issuedType");
mongoose.pluralize(null);

const visaApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth:{
      type:String
    },
    passportNumber:{
      type:String
    },
    purposeOfVisit:{
      type:String
    },
    travelDates:{
      type:String
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visa",
    },
    visaType: {
      type: String,
      required: true,
    },
    visaCategory: {
      type: String
    },
    image:{
      type:String
    },
    documents: [],
    bookingStatus: {
      type: String,
      enum:[bookingStatus.BOOKED,bookingStatus.CANCEL,bookingStatus.PENDING],
      default: bookingStatus.PENDING,
    },
    // Add other application-related fields as needed
  },
  { timestamps: true }
);
visaApplicationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("VisaApplication", visaApplicationSchema);
