const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const GrnCityListSchema = new mongoose.Schema({
  cityCode: Number,
  cityName: String,
  countryCode: String,
  countryName:String
});
const GrnCountryListSehema = new mongoose.Schema({ 
countryCode:String,
countryCode3:String,
countryName:String
})

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
GrnCountryListSehema.plugin(mongoosePaginate);
GrnCountryListSehema.plugin(aggregatePaginate);
const GrnCityList = mongoose.model("grnCityList", GrnCityListSchema);
const GrnHotelCityMap = mongoose.model(
  "grnHotelCityMap",
  GrnHotelCityMapSchema
);
const GrnCountryList=mongoose.model("grnCountryList",GrnCountryListSehema)

module.exports = { GrnCityList, GrnHotelCityMap,GrnCountryList };
