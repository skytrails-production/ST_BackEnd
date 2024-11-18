const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const searchType = require("../../enums/offerType");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const callbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    destination: { type: String },
    departureCity: { type: String },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    consent: { type: Boolean },
    travelDate: { type: String },
    preferedHotelStar: { type: Number },
    numberOfNight: { type: Number },
    numberofTraveller: { type: Number },
    adult: { type: Number },
    child: { type: Number },
    budget: { type: Number },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    msg:{type:String}
  },
  { timestamps: true }
);
callbackSchema.plugin(mongoosePaginate);

callbackSchema.plugin(aggregatePaginate);
const callBackRequestModel = mongoose.model("ContactRequest", callbackSchema);
module.exports = callBackRequestModel;
