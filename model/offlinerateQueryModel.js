const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../enums/status");
const errorType=require("../enums/errorType")
const bookingStatus = require("../enums/bookingStatus");
const offerType = require("../enums/offerType");
const approvalStatus = require("../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const QuerySchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    origin: {
      type: String,
    },
    destination: {
      type: String,
    },
    message: {
      type: String,
    },
    resolveStatus: {
      type: String,
      enum: [
        errorType.PENDING,errorType.RESOLVED
      ],
      default:errorType.PENDING
    },
    queryType: {
      type: String,
      enum: [
        offerType.FLIGHTS,
        offerType.BUS,
        offerType.HOTELS,
        offerType.HOLIDAYS,
      ],
      default: offerType.FLIGHTS,
    },
  },
  { timeStamp: true }
);
QuerySchema.plugin(mongoosePaginate);

QuerySchema.plugin(aggregatePaginate);
const Advertisement = mongoose.model(
  "offlineQuery",
  QuerySchema
);

module.exports = Advertisement;
