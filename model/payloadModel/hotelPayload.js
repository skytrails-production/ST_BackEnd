const mongoose = require("mongoose");
mongoose.pluralize(null);

const hotelPayloadSchema = new mongoose.Schema({
  id: { type: Number },
  tag: { type: String,default:"Hotels, Budget Hotels, 3 Star Hotels, 4 Star Hotels, 5 Star Hotels"},
  tboCityCode: { type: Number },
  cityName: { type: String },
  tboCityCode: { type: Number },
  tboCountryName: { type: String },
  tboCountryCode: { type: String },
  tbostateProvince: { type: String },
  tbostateProvinceCode: { type: String },
  grnCityCode: { type: Number },
  grnCountryName: { type: String },
  grnCountryCode: { type: String },
  adult: { type: Number,default:1 },
  child: { type: Number,default:0 },
  image: { type: String },
  isTrending:{type:Boolean},
  isInternational:{type:Boolean}
},
{ timestamps: true });

module.exports = mongoose.model("hotelStaticPayloads", hotelPayloadSchema);
