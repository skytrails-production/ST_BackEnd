const mongoose = require("mongoose");
// const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const flightStaticPayloadContent = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    from: {
      type: String,
    },
    destination: {
      type: String,
    },
    airportDepCode: {
      type: String,
    },
    airportArrCode: {
      type: String,
    },
    combineCode: {
      type: String,
    },
    images: {
      type: String,
    },
    fromDetails: {
      AirportCode: {
        type: String,
      },
      CityCode: {
        type: String,
      },
      CountryCode: {
        type: String,
      },
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      airportName: {
        type: String,
      },
      cityName: {
        type: String,
      },
      id: {
        type: String,
      },
    },
    to: {
      AirportCode: {
        type: String,
      },
      CityCode: {
        type: String,
      },
      CountryCode: {
        type: String,
      },
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      airportName: {
        type: String,
      },
      cityName: {
        type: String,
      },
      id: {
        type: String,
      },
    },
    isTrending: { type: Boolean },
  },
  { timestamps: true }
);
// flightPayloadContent.plugin(mongoosePaginate);
module.exports = mongoose.model(
  "flightStaticPayload",
  flightStaticPayloadContent
);

// const staticContens=mongoose.model("flightPayload", flightStaticContent).findOne({})
