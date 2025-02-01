const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
const approvalStatus = require("../../enums/approveStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const bookEventSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    email:{type: String,},
    name:{type:String},
    city:{type: String},
    profession:{type: String},
    contactNo: {
      country_code: {
        type: String,
        default: "+91",
      },
      mobile_number: { type: String },
    },
    noOfMember: {
      type: Number,
    },
    adults:{
      type: Boolean,
    },
    child:{
      type: Boolean,
    },
    couple:{
      type: Boolean,
    },
    price: {
      type: Number,
    },
    eventDate:{
      type: String
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "userTransactions",
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "skyTrailsEvents",
    },
    tickets: [
       { type: String } 
    ],
    isCoupanApplied:{
      type:Boolean,
      default:false
    },
    deviceToken:{type:String},
    deviceType:{type:String},
    isluckyUser:{type:Boolean,
      default:true},
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    bookingStatus:{
      type:String,
      enum:[bookingStatus.BOOKED,bookingStatus.CANCEL,bookingStatus.FAILED,bookingStatus.PENDING],
      default:bookingStatus.PENDING
    },
   
  },
  { timestamps: true }
);
bookEventSchema.plugin(mongoosePaginate);

bookEventSchema.plugin(aggregatePaginate);
const book = mongoose.model("eventBookings", bookEventSchema);

module.exports = book;
