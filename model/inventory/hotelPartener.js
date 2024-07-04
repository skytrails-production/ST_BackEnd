const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
const mealtype = require("../../enums/mealType");
mongoose.pluralize(null);

const GstSchema = new mongoose.Schema({
  _id: false,
  amount: Number,
  amountType: String,
  currency: String,
  included: String,
  name: String,
});

const NetSchema = new mongoose.Schema({
  _id: false,
  amount: Number,
  amountType: String,
  currency: String,
  included: String,
  name: String,
});

const hotelInventorySchema = new mongoose.Schema(
  {
    hotelName: { type: String },
    description: { type: String },
    locality: { type: String },
    hotelCity: { type: String },
    hotelCountry: { type: String },
    hotelState: { type: String },
    panCard: { type: String },
    rating: { type: Number,min: 0, max: 5 },
    totalRooms: { type: Number },
    availableRooms: { type: Number },
    hotelImages: [{ type: String }],
    typeOfRoom: [{ type: String }],
    mealType: [
      {
        type: String,
        enum: [mealtype.BREAKFAST, mealtype.DINNER, mealtype.LUNCH],
      },
    ],
    cityCode: { type: String },
    amenities: [{ type: String }],
    hotelAddress: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    hotelCode: { type: String },
    hotelPolicy: { type: String },
    facilities: [String],
    bookingPolicy: [String],
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    rooms: [
      {
        description: String,
        noOfAdult: Number,
        noOfChildren: Number,
        room_type: String,
        roomsImages: [],
        room_Price: Number,
        totalRooms: { type: Number },
        availableRooms: { type: Number },
        priceDetails: {
          gst: [GstSchema],
          net: [NetSchema],
        },
        roomAmineties: [String],
      },
    ],
    safe2Stay: [String],
  },
  { timestamps: true }
);

hotelInventorySchema.plugin(mongoosePaginate);
hotelInventorySchema.plugin(aggregatePaginate);
hotelInventorySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("hotelInventory", hotelInventorySchema);
