const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { string } = require("joi");

const SsdcModel = new mongoose.Schema(
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
    currentSalary:{
        type:Number,
    },
  },
  { timestamps: true }
);
SsdcModel.plugin(mongoosePaginate);
SsdcModel.plugin(aggregatePaginate);
module.exports = mongoose.model("ssdcLeads", SsdcModel);
