const mongoose = require("mongoose");

const AirportCode = mongoose.model(
  "AirportCode",
  new mongoose.Schema(
    {
      DestinationCode: { type: String },
      AirportName: { type: String },
      AirportCode: { type: String },
      CityName: { type: String },
      CityCode: { type: String },
      CountryCode: { type: String },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = AirportCode;
