const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");

const approveStatus = require("../../enums/approveStatus");
const errorType=require("../../enums/errorType")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);


const QuerySchema = new mongoose.Schema(
    {
      email: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
      name: {
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
    },
    { timeStamp: true }
  );
  QuerySchema.plugin(mongoosePaginate);
  
  QuerySchema.plugin(aggregatePaginate);
  const query = mongoose.model(
    "userEnquiry",
    QuerySchema
  );
  
  module.exports = query;
  