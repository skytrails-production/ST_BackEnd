const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
const jobType = require("../../enums/jobType");
const locationType = require("../../enums/locationType");
mongoose.pluralize(null);

const jobSchema = new mongoose.Schema(
  {
    designation: { type: String },
    AboutCompany: { type: String },
    jobDescription: { type: String },
    desiredProfile: { type: String },
    preferredIndustry: { type: String },
    jobFunctions: { type: String },
    responsibilities: { type: String },
    expirience: { type: String },
    description: { type: String },
    jobType: {
      type: String,
      enum: [
        jobType.FULLTIME,
        jobType.INTERNSHIP,
        jobType.PARTTIME,
        jobType.REMOTE,
      ],
    },
    locationType: {
      type: String,
      enum: [
        locationType.ALL,
        locationType.HYBRID,
        locationType.ONSITE,
        locationType.REMOTE,
      ],
    },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    skills: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    datePosted: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
jobSchema.plugin(mongoosePaginate);
jobSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("skyOpenings", jobSchema);
