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

const hotelEventsSchema=new mongoose.Schema({
  _id:false,
  type:String,
  title:String,
  name:String,
  description:String

});


const flightEventsSchema= new mongoose.Schema({
  _id:false,
  type:{
    type:String,
    default:"Flight"
  },
  title:String

});


const transferEventsSchema= new mongoose.Schema({
  _id:false,
  type:{
    type:String,
    default:"Transfer"
  },
  title:String
});


const activityEventsSchema= new mongoose.Schema({
  _id:false,
  type:{
    type:String,
    default:"Activity"
  },
  title:String

});

const descriptionEventsSchema= new mongoose.Schema({
  _id:false,

});

const attractionEventsSchema=new mongoose.Schema({
  _id:false,

});


const leisureDayEventsSchema=new mongoose.Schema({
  _id:false,

});






const mealsIncludedWithHotelsSchema= new mongoose.Schema({
  _id:false,
    location:{
        type:String,
    },
    meal:{
        type:String,
    }
})


// Define the itinerary schema
const itinerarySchema = new mongoose.Schema({
    title: {
      type: String,
    },
    day_number: {
      type: Number,
    },
    hotelEvents: {
      type: [hotelEventsSchema],
      default: [],
    },
    flightEvents: {
      type: [flightEventsSchema],
      default: [],
    },
    transferEvents: {
      type: [transferEventsSchema],
      default: [],
    },
    activityEvents: {
      type: [activityEventsSchema],
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
    mealsIncluded: {
      type: [String],
      default: [],
    },
    mealsIncludedWithHotels: {
      type: [mealsIncludedWithHotelsSchema],
      default: [],
    },
  });



const SkyTrailsPackageSchema = new mongoose.Schema(
  {
    userId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "userb2bs",
      type: String,
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
    packageAmount: {
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
    },
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
      stays: {
        type: [String], // Array of image URLs/strings
        default: [], // Default to an empty array
      },
      destinations: {
        type: [String], // Array of image URLs/strings
        default: [], // Default to an empty array
      },
      activities: {
        type: [String], // Array of image URLs/strings
        default: [], // Default to an empty array
      },
    },
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
