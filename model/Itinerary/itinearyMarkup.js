const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const itineraryMarkupSchema = new mongoose.Schema({
  originCity: {
    type: String,
    trim: true
  },
  destinationCity:{type: String,
    trim: true},
  markup: {
    value: Number,
    valueType:String
  },
//   startDate: {
//     type: Date,
//   },
//   endDate: {
//     type: Date,
//   },
  status: {
    type: String,
    enum: Object.values(status),
    default: status.ACTIVE
  }
}, 
{
  timestamps: true
});

itineraryMarkupSchema.plugin(mongoosePaginate);
itineraryMarkupSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("itineraryMarkup", itineraryMarkupSchema);
