const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const GrnCityListSchema = new mongoose.Schema({
  cityCode: Number,
  cityName: String,
  countryCode: String,
});

const GrnHotelCityMapSchema = new mongoose.Schema({
  hotelCode: {
    type: Number,
  },
  locationCode: {
    type: Number,
  },
  cityCode: {
    type: Number,
  },
});

GrnCityListSchema.plugin(mongoosePaginate);
GrnCityListSchema.plugin(aggregatePaginate);
GrnHotelCityMapSchema.plugin(mongoosePaginate);
GrnHotelCityMapSchema.plugin(aggregatePaginate);
const GrnCityList = mongoose.model("grnCityList", GrnCityListSchema);
const GrnHotelCityMap = mongoose.model(
  "grnHotelCityMap",
  GrnHotelCityMapSchema
);

module.exports = { GrnCityList, GrnHotelCityMap };
