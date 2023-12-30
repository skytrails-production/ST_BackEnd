const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const searchType = require("../../enums/offerType");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);
const userSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    origin: {
      type: String,
    },
    destination: {
      type: String,
    },
    journeyDate: {
      type: String,
    },
    journeyType:{
        type: String, 
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    searchType: {
      type: String,
      enum: [
        searchType.BUS,
        searchType.CABS,
        searchType.FLIGHTS,
        searchType.HOTELS,
        searchType.TRAINS,
        searchType.HOLIDAYS,
      ],
    },
  },
  { timestamps: true }
);
userSearchSchema.plugin(mongoosePaginate);

userSearchSchema.plugin(aggregatePaginate);

const userSearch = mongoose.model("userSearcheHistory", userSearchSchema);
module.exports = userSearch;
