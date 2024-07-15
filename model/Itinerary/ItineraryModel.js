const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const itinerarySchema = new mongoose.Schema(
  {
    origin: {
      type: String,
    },
    destination: {
      type: String,
    },
    days: {
      type: Number,
    },
    pakageAmount: {
      currency: {
        type: String,
        enum: ["USD", "EUR", "INR"],
        default: "INR",
      },
      amount: {
        type: Number,
      },
    },
    itenerieData: [
      {
        itineraryId: {
          type: mongoose.Types.ObjectId,
          ref: "dayWiseItinerary",
        },
        // iteneries:[{title: { type: String },
        // description: { type: String },
        // price: { type: Number },
        // type: { type: String },
        // activities: [
        //   {
        //     _id: false,
        //     title: { type: String },
        //     description: { type: String },
        //     timing: { type: String },
        //     price: { type: Number },
        //   },]
        // }],
        itenararyResult: [],
        activities: [],
      },
    ],
    costExcludes: {
      type: Array,
      default: [],
    },
    compliments: {
      type: Array,
      default: [],
    },
    freebies: {
      type: String,
    },
    exclusionNote: {
      type: String,
    },
    detailedItinerary: {
      type: Array,
      default: [],
    },
    overview: {
      type: String,
    },
    selectTags: {
      type: Array,
      default: [],
    },
    termConditions: {
      type: String,
    },
    cancellationPolicy: {
      type: String,
    },
    paymentPolicy: {
      type: String,
    },
    isActive: {
      type: Number,
      default: activeStatus.IN_ACTIVE,
    },
    hotelDetails: [
      {
        HotelAddress: String,
        HotelLocation: String,
        HotelName: String,
        StarRating: Number,
        ResultIndex: Number,
        HotelCode: String,
        HotelCategory: String,
        Price: Number,
        HotelPicture: String,
        selectedRoom: {
          Amenities: [String],
          Inclusion: [String],
          RoomTypeName: String,
          PublishedPriceRoundedOff: Number,
        },
      },
    ],
    flightData: [
      {
        id: { type: String },
        flightDetails: [
          {
            AirlineCode: String,
            Fare: { PublishedFare: Number },
            IsLCC: Boolean,
            Segments: [],
          },
        ],
      },
    ],
    ItenaryPayloadData: {
      RoomGuests: [{ NoOfAdults: Number, NoOfChild: Number, ChildAge: [] }],
      cityAndNight:[{night:Number,destination:String}],
      leavingFrom:String,
      nationality:String
    },
    priceData:{grandTotal:String,markup:Number,withoutMarkup:Number}
  },
  { timestamps: true }
);
itinerarySchema.plugin(mongoosePaginate);
itinerarySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("customizePackageProposal", itinerarySchema);
