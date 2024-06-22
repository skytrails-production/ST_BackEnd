const mongoose = require("mongoose");

const cityData = mongoose.model(
  "cityData",
  new mongoose.Schema(
    {
      id: { type: String },
      code: { type: String },
      AirportCode: { type: String },
      name: { type: String },
      CityCode: { type: String },
      CountryCode: { type: String },
      CountryName:{ type: String}
    },
    {
      timestamps: true,
    }
  )
);

const cityBusData = mongoose.model(
  "cityBusData",
  new mongoose.Schema({
    CityId: { type: String, required: true },
    CityName: { type: String, required: true },
  })
);

const cityBusProductionData = mongoose.model(
  "cityBusProductionData",
  new mongoose.Schema({
    CityId: { type: String, required: true },
    CityName: { type: String, required: true },
  })
);

const newhotelCityCode = mongoose.model(
  "newhotelCityCode",
  new mongoose.Schema({
    cityid: { type: String },
    Destination: { type: String },
    stateprovince: { type: String },
    StateProvinceCode: { type: String },
    country: { type: String },
    countrycode: { type: String },
  })
);

const userIPDetail=mongoose.model(
  "userIPDetails",
  new mongoose.Schema({
    userIp:String,
    bookingType:String,
  },{
    timestamps:true
  })
);

//airlineList

const airlineData=mongoose.model("airlineList",
  new mongoose.Schema({    
airlineName:String,
airlineCode:String
  })
);

module.exports = { cityData, cityBusData, newhotelCityCode,cityBusProductionData, userIPDetail, airlineData};
