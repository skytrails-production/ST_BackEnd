const mongoose = require("mongoose");

const hotelFormSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
    },
    hotelCity: {
      type: String,
      required: true,
    },
    hotelCountry: {
      type: String,
      required: true,
    },
    hotelState: {
      type: String,
      required: true,
    },
    panCard: {
      type: String,
      required: true,
    },
    Rating: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    hotelFacilities: {
      type: [String],
      required: true,
    },
    hotelImages: {
      type: [String], // Specify that hotelImages is an array of strings
      required: true,
    },
    rooms: [
      {
        roomType: [String],
        facilities: [String],
        inclusions: [String],
        maximumAccomodation: [Number],
        roomsImage: [String],
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("hotelForm", hotelFormSchema);
