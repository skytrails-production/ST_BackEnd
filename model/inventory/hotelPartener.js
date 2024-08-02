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
  included: Boolean,
  name: String,
});

const NetSchema = new mongoose.Schema({
  _id: false,
  amount: Number,
  amountType: String,
  currency: String,
  included: Boolean,
  name: String,
});

const WeekdaySchema = new mongoose.Schema({
  noOfAdult: Number,
  noOfChildren: Number,
  room_Price: Number,
  isSingle: Boolean,
  isDouble: Boolean,
  isCP:Boolean,
  isMAP:Boolean,
  isEP:Boolean,
  isJAP:Boolean
}, { _id: false });

const WeekendSchema = new mongoose.Schema({
  noOfAdult: Number,
  noOfChildren: Number,
  room_Price: Number,
  isSingle: Boolean,
  isDouble: Boolean,
  isCP:Boolean,
  isMAP:Boolean,
  isEP:Boolean,
  isJAP:Boolean
}, { _id: false });

const PriceDetailsSchema = new mongoose.Schema({
  gst: [GstSchema],
  net: [NetSchema],
  Weekday: [WeekdaySchema],
  Weekend: [WeekendSchema],

}, { _id: false });

const RoomSchema = new mongoose.Schema({
  description: String,
  room_type: String,
  roomsImages: [String],
  totalRooms: Number,
  availableRooms: Number,
  priceDetails: PriceDetailsSchema,
  roomAmineties: [String],

}, { _id: false });

const hotelInventorySchema = new mongoose.Schema(
  {
    partnerId: { type: mongoose.Types.ObjectId, ref: "hotelPartnerDetail" },
    hotelName: String,
    CompanyName: String,
    gstNo:String,
    description: String,
    locality: String,
    hotelCity: String,
    hotelCountry: String,
    hotelState: String,
    panCard: String,
    rating: { type: Number, min: 0, max: 5 },
    totalRooms: Number,
    availableRooms: Number,
    hotelImages: [String],
    typeOfRoom: [String],
    mealType: {
      type: [String],
      enum: [mealtype.BREAKFAST, mealtype.DINNER, mealtype.LUNCH],
    },
    cityCode: String,
    amenities: [String],
    hotelAddress: String,
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    hotelCode: String,
    hotelPolicy: [String],
    facilities: [String],
    bookingPolicy: [String],
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    rooms: [RoomSchema],
    safe2Stay: [String],
    availableDate: String,
    startFrom: String,
  },
  { timestamps: true }
);

hotelInventorySchema.plugin(mongoosePaginate);
hotelInventorySchema.plugin(aggregatePaginate);
hotelInventorySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("hotelInventory", hotelInventorySchema);
