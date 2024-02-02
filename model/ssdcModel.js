const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { string } = require("joi");

const jobSchema = new mongoose.Schema({
  category: String,
  nos: Number,
  salary: String
});


const SsdcJobSchema = new mongoose.Schema({
  country: String,
  image: String,
  interviewDate: String,
  interviewAddress: String,
  jobs: [jobSchema],
  employmentPeriod: String,
  visaType: String,
  workingHours: String,
  Foodetc: String
});

const SsdcSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    department: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    experience:{
        type: String,
      enum:["Yes","No"]
    },
    years:{
        type: Number,
    },
    company:{
        type:String,
    },
    years:{
      type:Number,
    },
    currentSalary:{
        type:String,
    },
  },
  { timestamps: true }
);

SsdcSchema.plugin(mongoosePaginate);
SsdcSchema.plugin(aggregatePaginate);
SsdcJobSchema.plugin(mongoosePaginate);
SsdcJobSchema.plugin(aggregatePaginate);
const SsdcJob = mongoose.model("SsdcJobs", SsdcJobSchema);
const SsdcModel= mongoose.model("ssdcLeads", SsdcSchema);


module.exports = {SsdcJob ,SsdcModel};