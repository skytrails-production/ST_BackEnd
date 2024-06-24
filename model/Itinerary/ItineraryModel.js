const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { activeStatus } = require("../common/const");
const status = require("../../enums/status");
mongoose.pluralize(null);

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userb2bs",
    },
    pakage_title: {
      type: String,
    },
    pakageImg: {
      type: String,
    },
    packageGallery: {
      type: Array,
    },
    destination: {
      type: Array,
    },
    country: {
      type: String,
    },
    days: {
      type: Number,
      minLength: [2, "Please enter more than two day"],
    },
    schedule: {
      flexible: {
        type: Boolean,
        default: true,
      },
      fixed_departure: {
        type: Boolean,
        default: false,
      },
    },
    pakage_amount: {
      currency: {
        type: String,
        enum: ["USD", "EUR", "INR"],
        default: "INR",
      },
      amount: {
        type: Number,
      },
    },
    insclusions: {
      type: Array,
      default: [],
    },
    hotelDetails: {
      type: String,
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
    Hotels:[{
        'city':String,
        'hotelname':String,
        'rating':Number,
        'room':Number,
        'mealPlan':String,
        'dates':String
    }],
    days:{
        type: Number,}
  },
  { timestamps: true }
);
itinerarySchema.plugin(mongoosePaginate);
itinerarySchema.plugin(aggregatePaginate);
module.exports = mongoose.model("customizePackageProposal", itinerarySchema);
