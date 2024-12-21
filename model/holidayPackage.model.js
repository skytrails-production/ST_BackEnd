const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../enums/status");
const bookingStatus = require("../enums/bookingStatus");
const { activeStatus } = require("../common/const");

// const specialTagSchema = new mongoose.Schema({
//   _id:false,
//   type:String,
//   default:""
// });



const flightEventsSchema= new mongoose.Schema({
  _id:false,
  type:{
    type:String,
    default:"Flight"
  },
  from:String,
  to:String,
  fromAirPortCode: {
    type: String,
    set: (v) => v.toUpperCase() // Setter to convert to uppercase
  },
  toAirPortCode: {
    type: String,
    set: (v) => v.toUpperCase() // Setter to convert to uppercase
  }

});


const transferEventsSchema= new mongoose.Schema({
  _id:false,
  type:{
    type:String,
    default:"Transfer"
  },
  title:String,
  fromLocation:String,
  toLocation:String,
});


const descriptionEventsSchema= new mongoose.Schema({
  _id:false,

});

const attractionEventsSchema=new mongoose.Schema({
  _id:false,

});


const leisureDayEventsSchema=new mongoose.Schema({
  _id:false,
type:{
  type:String,
  default:"Leisure Day"
},
title:String
});








// Define the itinerary schema
const itinerarySchema = new mongoose.Schema({
    title: {
      type: String,
    },
    description:{
      type:String,
    },
    dayNumber: {
      type: Number,
    },
    itineraryImages: {
      type: [String], // Array of image URLs/strings
      default: [], // Default to an empty array
    },
    flightEvents: {
      type: [flightEventsSchema],
      default: [],
    },
    transferEvents: {
      type: [transferEventsSchema],
      default: [],
    },
    descriptionEvents: {
      type: [descriptionEventsSchema],
      default: [],
    },
    attractionEvents: {
      type: [attractionEventsSchema],
      default: [],
    },
    leisureDayEvents: {
      type: [leisureDayEventsSchema],
      default: [],
    },
    
  });



const SkyTrailsPackageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userb2bs",
      // type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview:{
        type:String,
        required:true,
        trim:true
    },
    packageHighLight:{
      type: [String],
      default: [],
    },
    coverImage: String,
    packageType: {
      type: String,
      enum: ["Domestic", "International"],
      required: true,
    },
    country: [String],
    days: {
      type: Number,
      min: [2, "Please enter more than two days"],
    },
    destination: {
      type: Array,
      require: true,
    },
   
    packageAmount: [{
      _id:false,
      currency: {
        type: String,
        enum: ["USD", "EUR", "INR"],
        required: true,
        default: "INR",
      },
      amount: {
        type: Number,
        required: true,
      },
      packageCategory: {
        type: String,
        enum: ["Deluxe", "Standard", "Luxury"],  // Enum with predefined values
        required: true,  // This field is mandatory
      }
    }],
    specialTag: {
      type: Array,
      require: true,
    },
    inclusions:{
      type:Array,
      default:[]
    },
    insclusion_note:[String],
    exclusion_note:[String],
    term_Conditions: [String],
    cancellation_Policy: [String],
    images: {
      // stays: {
      //   type: [String], // Array of image URLs/strings
      //   default: [], // Default to an empty array
      // },
      stays:{
        type:[{
          _id: false,
        hotelType: {
          type: String,
        },
        hotelName: {
          type: String,
        },
        itineraryDay:{
          type:Number
        },
        description:String,
        hotelStar:Number,
        checkIn:String,
        checkOut:String,
        numberOfNights:Number,
        mealsIncluded: {
          type: [String],
          default: [],
        },
        Images: [{
          type: String,  // Image URLs or strings
        }]
      }],
      default:[]
    },
      destinations: {
        type: [String], // Array of image URLs/strings
        default: [], // Default to an empty array
      },
      activities: {
        type:[{
          _id: false,
        title: {
          type: String,
        },
        itineraryDay:{
          type:Number
        },
        Images: [{
          type: String,  // Image URLs or strings
        }]
      }],
      default:[]
      },
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "userBtoC",
      default: []
    }],
    is_active: {
      type: Number,
      default: activeStatus.IN_ACTIVE,
    },
    packageSeason:{
        type:String,
        enum:["Oct-Jan","Feb-May","Jun-Sep"]
    },
    detailed_ltinerary:[itinerarySchema]
  },
  { timestamps: true }
);




const SkyTrailsPackageModel = mongoose.model(
  "SkyTrailsPackages",
  SkyTrailsPackageSchema
);

module.exports = { SkyTrailsPackageModel };
