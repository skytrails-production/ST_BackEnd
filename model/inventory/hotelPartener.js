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
    rating: { type: Number },
    totalPrice: { type: Number },
    totalRooms: { type: Number },
    availableRooms: { type: Number },
    // hotelFacilities: [{ type: { type: String } }],
    hotelImages: [{ type: String }],
    typeOfRoom: [{ type: String }],
    // meal: [{ type: String }],
    mealType: [
      {
        type: String,
        enum: [mealtype.BREAKFAST, mealtype.DINNER, mealtype.LUNCH],
      },
    ],
    cityCode: { type: String },
    amenities: [
     {type:String}
    ],
    hotelAddress: { type: String },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    hotelCode: String,
    hotelPolicy: String,
    facilities: [String],
    bookingPolicy: [String],
    // priceDetails: [
    //   {
    //     _id: false,
    //     gst: [GstSchema],
    //     net: [NetSchema],
    //   },
    // ],
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    // rooms: {type:mongoose.Types.ObjectId,ref:'hotelRooms '},
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
          }
      },
    ],
    overView: String,
    safe2Stay: [String],
  },
  { timestamps: true }
);

hotelInventorySchema.plugin(mongoosePaginate);
hotelInventorySchema.plugin(aggregatePaginate);

module.exports = mongoose.model("hotelInventory", hotelInventorySchema);
