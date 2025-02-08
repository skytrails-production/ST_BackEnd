const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../enums/status");
const approveStatus = require("../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);
const eventsSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    // description: [
    //   {type: String},
    // ],
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    price: {
      type: Number,
    },
    slot: [{}],
    bookingPrice: {
      type: Number,
    },
    adultPrice: {
      type: Number,
    },
    childPrice: {
      type: Number,
    },
    couplePrice: {
      type: Number,
    },
    showType: {
      type: String,
    },
    age: {
      type: String,
    },
    venue: {
      type: String,
    },
    gallery: [{ type: String }],
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    isPaid:{
      type:Boolean
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    saleCount:{
      type:Number
    },
    registrationRequired:{
      type:Boolean,
      default:true
    },
    eventCountry:{
      type: String,
    },
    forCouple:{
      type:Boolean,
      default:false
    },
    requiredFormFields: {
      type: [{
        key: { type: String}, 
        dataType: { type: String},
        isRequired: { type: Boolean, default: false }, 
        defaultValue: { type: Schema.Types.Mixed }
      }],
      default: [],
    },
    TNC:[],
    maxTicketsPerUser: { type: Number,max: 5}
  },
  { timestamps: true }
);
eventsSchema.plugin(mongoosePaginate); 

eventsSchema.plugin(aggregatePaginate);
const events = mongoose.model("skyTrailsEvents", eventsSchema);

module.exports = events;
 