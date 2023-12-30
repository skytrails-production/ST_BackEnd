const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const hotelBookingDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "user ID is required"],
      ref: "userb2bs",
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },

    phone:
      { type: String, required: [true, 'phone is required'] },

    email: {
      type: String,
      required: [true, 'email is required'],
      match: [/.+\@.+\..+/, 'Please enter a valid email'],
    },
    address: {
      type: String,
      required: [true, 'address is required'],
    },
    destination: {
      type: String,
      required: [true, 'destination is required'],
    },
    bookingId: {
      type: Number,
      required: [true, 'booking id is required'],
    },
    noOfPeople : {
      type : Number,
      required: [true, 'no of people is required']
    },
    CheckInDate: {
      type: Date,
      required: [true, 'Date of check in  required']
    },
    CheckOutDate: {
      type: Date,
      required: [true, 'Date of check in  required']
    },
    
    hotelName: {
      type: String,
      required: [true, 'hotel name is required'],
    },
    cityName: {
      type: String,
      required: [true, 'city name is required']
    },
    hotelId: {
      type: Number,
      required: [true, 'hotel Id is required']
    },
    
    country: {
      type: String, required: [true, 'Country is required']
    },
    room: {
      type: Number, required: [true, 'Room is required']
    },
    
    amount :{
      type : Number, required : [true, 'Amount is required'],
    },
    status: {
      type: String,
      default: status.ACTIVE
    },
    bookingStatus: {
      type: String,
      default: bookingStatus.PENDING
    }
  },
  { timestamps: true }
)
hotelBookingDetailSchema.plugin(mongoosePaginate);

hotelBookingDetailSchema.plugin(aggregatePaginate);

const hotelBookingDetail = mongoose.model("hotelBookingDetail", hotelBookingDetailSchema);
module.exports = hotelBookingDetail;