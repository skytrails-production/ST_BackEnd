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
        rating:Number,
        imageUrl:String,
        roomName:String,
        mapUrl:String,       
        address: String,
        bookingId: String,
        CheckInDate:String,
        hotelName: String,
        cityName: String,
        hotelId: Number,
        room:Number,
        country: String,               
        CheckOutDate:  String,
        amount:Number,
        paxes:[
            {
                title: String,
                firstName:String,
                lastName:String,
                phoneNo:String,
                paxType:Number,
                email:String,
                panNo:String,
                age:Number,
                leadPassenger:Boolean,
                passportNumber:String,
                passportExpire:String,
            }
        ],
        refundable:{
            type:String,
            default:""
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
        },
        bookingPartyType:{type:String,default:'TBO'},
    },
    { timestamps: true }
)
hotelBookingDetailSchema.plugin(mongoosePaginate);

hotelBookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userHotelBookingDetail", hotelBookingDetailSchema);