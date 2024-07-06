const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const itinerarySchema = new mongoose.Schema(
  {
    pakageTitle: {
      type: String,
    },
    // pakageImg: {
    //   type: String,
    // },
    // packageGallery: {
    //   type: Array,
    // },
    origin: {
      type: String,
    },
    destination: {
      type: String,
    },
    country: {
      type: String,
    },
    days: {
      type: Number,
    },
    // schedule: {
    //   flexible: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   fixedDeparture: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
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
    itineraryId:{
      type:mongoose.Types.ObjectId,
      ref:'dayWiseItinerary'
    },
    iteneries:[{
      title: { type: String },
      description: { type: String },
      price: { type: Number },
      type: { type: String },
      activities: [
        {
          _id: false,
          title: { type: String },
          description: { type: String },
          timing: { type: String },
          price: { type: Number },
        },
      ],
    }],
    insclusions: {
      type: Array,
      default: [],
    },
    highlights: {
     type: Array,
      default: [],
    },
    insclusionNote: {
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
    isActive: {
      type: Number,
      default: activeStatus.IN_ACTIVE,
    },
    hotelDetails:[{
        'city':String,
        'hotelname':String,
        'rating':Number,
        'room':Number,
        'mealPlan':String,
        'dates':String,
        'description':String
    }],
    flightDetails:[{
      'origin':String,
      'destination':String,
      airlineDetails: [

      {
        _id:false,
        Airline: {
        
            AirlineCode: { type: "string" },
            AirlineName: { type: "string" },
            FlightNumber: { type: "string" },
            FareClass: { type: "string" },
          },
        
        Origin: {
          
            AirportCode: { type: "string" },
            AirportName: { type: "string" },
            CityName: { type: "string" },
            Terminal: { type: "string" },
            DepTime: { type: "string", format: "date-time" },
          
        },
        Destination: {
         
            AirportCode: { type: "string" },
            AirportName: { type: "string" },
            CityName: { type: "string" },
            Terminal: { type: "string" },
            ArrTime: { type: "string", format: "date-time" },
          
        },
        Baggage: { type: "string" },
      },
    ],
    baggage: [
      {
        _id:false,
        AirlineCode: String,
        FlightNumber: String,
        WayType: Number,
        Code: String,
        Description: String,
        Weight: Number,
        Currency: String,
        Price: Number,
        Origin: String,
        Destination: String,
      },
    ],
    mealDynamic: [
      {
        _id:false,
        AirlineCode: String,
        FlightNumber: String,
        WayType: Number,
        Code: String,
        Description: Number,
        AirlineDescription: String,
        Quantity: Number,
        Currency: String,
        Price: Number,
        Origin: String,
        Destination: String,
      },
    ],
    dateOfJourney: { type: String },
    }],
    dateOfJourney: { type: String }
  },
  { timestamps: true }
);
itinerarySchema.plugin(mongoosePaginate);
itinerarySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("customizePackageProposal", itinerarySchema);
