const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const dayWiseItinerarySchema = new mongoose.Schema(
  {
    destination: { type: String },
    origin: { type: String },
    dayAt: [
      {
        title: { type: String },
        description: { type: String },
        price: { type: Number },
        type: { type: String },
      },
    ],
    activities: [
      {
        _id: false,
        title: { type: String },
        description: { type: String },
        timing: { type: String },
        price: { type: Number },
      },
    ],
    noOfDays:{ type: String }
  },
  { timestamps: true }
);
dayWiseItinerarySchema.plugin(mongoosePaginate); 
dayWiseItinerarySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("dayWiseItinerary", dayWiseItinerarySchema);
