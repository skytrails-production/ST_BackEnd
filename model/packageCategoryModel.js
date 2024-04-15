const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { string } = require("joi");


const packageSchema = new mongoose.Schema(
    {
     inclusion:String,
     images:String,
     colorCode:String,
     headingCode:String,
    },
    {
      timestamps: true,
    }
  );
  packageSchema.plugin(mongoosePaginate);
  packageSchema.plugin(aggregatePaginate);
  module.exports = mongoose.model("packageCategory", packageSchema);
  