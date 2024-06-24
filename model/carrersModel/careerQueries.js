const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
const resolveStatus = require("../../enums/errorType");
mongoose.pluralize(null);

const careerQuerySchema = new mongoose.Schema(
  {
    userName: { type: String }, // User's name
    userEmail: { type: String }, // User's email address
    userContactNumber: {
      countryCode: { type: String },
      number: { type: String },
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "skyOpenings" }, // Reference to the job
    query: { type: String }, // Content of the user's query
    status: {
      type: String,
      enum: [resolveStatus.PENDING, resolveStatus.RESOLVED],
      default: resolveStatus.PENDING,
    },
  },
  { timestamps: true }
);
careerQuerySchema.plugin(mongoosePaginate);
careerQuerySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("careerQueries", careerQuerySchema);
