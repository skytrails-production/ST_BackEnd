const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const { NumberContext } = require("twilio/lib/rest/pricing/v2/number");
const hotelBookingDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userBtoC",
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        phone:
        {      
                type: String
            },
        
        email: {
            type: String,
        },
        address: {
            type: String,
        },
        bookingId: {
            type: Number,
        },
        CheckInDate: {
            type: String,
        },
        hotelName: {
            type: String,
        },
        cityName: {
            type: String,
        },
        hotelId: {
            type: Number,
        },
        noOfPeople: {
            type: Number,
        },
        room:{
            type:Number
        },
        country: {
            type: String,
        },
        
        hotelName: {
            type: String,
        },
        
        CheckOutDate: {
            type: String,
        },
        amount: {
            type: Number,
        },
        status: {
            type: String,
            default: status.ACTIVE
        },
        bookingStatus: {
            type: String,
            enum:[bookingStatus.BOOKED,bookingStatus.CANCEL,bookingStatus.FAILED,bookingStatus.PENDING],
            default: bookingStatus.BOOKED
        },
        transactions:{
            type:mongoose.Types.ObjectId,
            ref:'transactions'
        },
        bookingType:{
            type:String,
            enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
            default:offerType.HOTELS
        }
    },
    { timestamps: true }
)
hotelBookingDetailSchema.plugin(mongoosePaginate);

hotelBookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userHotelBookingDetail", hotelBookingDetailSchema);