const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);

const userGrnHotelBookingSchema=new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "userBtoC",
    },
    agnet_reference:String,
    booking_date:String,
    booking_id:String,
    booking_reference:String,
    checkin:String,
    checkout:String,    
    total:Number,
    holder:{
      client_nationality:String,
      pan_number:String,
      email:String,
      phone_number:String,
      name:String,
      surname:String,
      title:{
        type:String,
        enum:["Mr.", "Ms.", "Mrs.", "Mstr."]
      }
    },
    hotel:{
      address:String,
      name:String,
      price:Number,
      imageUrl:String,
      phoneNumber:String,
      geolocation:{
        latitude:String,
        longitude:String
      },
      category:String,
      city_code:String,
      country_code:String,
      paxes:[{ 
        // _id:null,
        age:Number,
        name: String,
        pax_id: Number,
        surname: String,
        paxType:String,
        title: {
          type: String,
          enum: ["Mr.", "Ms.", "Mrs.", "Mstr."]
        }}],
      rooms:[{
        // _id:null,
        description: String,
        no_of_adults: Number,
        no_of_children:Number,
        no_of_rooms: Number  
      }],
      non_refundable:Boolean,
      cancellation_policy:{
        amount_type:String,
        cancel_by_date:String,
        details:[{
          from:String
        }]
      },

    },         
    status: {
        type: String,
        default: status.ACTIVE
    },
    bookingStatus: {
        type: String,
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
    isHomeHotel:{type:Boolean,defaul:false},
    homeHotelId:{type:mongoose.Types.ObjectId,ref:'hotelInventory'},
    bookingPartyType:{type:String,default:'GRN'}
},{ timestamps: true });

userGrnHotelBookingSchema.plugin(mongoosePaginate);

userGrnHotelBookingSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userGRNHotelBooking", userGrnHotelBookingSchema);