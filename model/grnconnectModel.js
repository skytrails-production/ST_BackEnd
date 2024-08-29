const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
const offerType = require("../enums/offerType");


const paxScehma = new mongoose.Schema({
  age:Number,
  name: String,
  pax_id: Number,
  surname: String,
  title: {
    type: String,
    enum: ["Mr.", "Ms.", "Mrs.", "Mstr."]
  }
});

const roomShema = new mongoose.Schema({
  description: String,
  no_of_adults: Number,
  no_of_children:Number,
  no_of_rooms: Number  
});



const grnHotelBookingDetailSchema = new mongoose.Schema(
  {
      userId: {
          type: Schema.Types.ObjectId,
          ref: "userb2bs",
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
        paxes:[paxScehma],
        rooms:[roomShema],
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
      }
  },
  { timestamps: true }
);

const GrnCityListSchema = new mongoose.Schema({
  cityCode: Number,
  cityName: String,
  countryCode: String,
  countryName:String
});
const GrnCountryListSehema = new mongoose.Schema({ 
countryCode:String,
countryCode3:String,
countryName:String
})

const GrnHotelCityMapSchema = new mongoose.Schema({
  hotelCode:Number,
  hotelName:String,
  cityCode:Number,
  address:String,
  countryCode:String,
  latitude:Number,
  longitude:Number
});



const GrnLocationCityMapSchema = new mongoose.Schema({
  hotelCode:Number,
  locationCode:Number,
  cityCode:Number,
});



const GrnLocationMasterSchema = new mongoose.Schema({
  locationCode:Number, 
  locationName:String,
  countryCode:String,
  countryName:String
});



const TboHotelCityListSchema = new mongoose.Schema({
  cityCode: Number,
  cityName: String,  
  stateProvince:String,
  stateProvinceCode:String,
  countryCode: String,
  countryName:String
});


const combineHotelCityListSchema = new mongoose.Schema({
  cityName: String,
  tboCityCode:Number,
  tboCountryName:String,
  tboCountryCode:String,
  tbostateProvince:String,
  tbostateProvinceCode:String,
  grnCityCode:Number,
  grnCountryName:String,
  grnCountryCode:String,
});





grnHotelBookingDetailSchema.plugin(mongoosePaginate);

grnHotelBookingDetailSchema.plugin(aggregatePaginate);


GrnCityListSchema.plugin(mongoosePaginate);
GrnCityListSchema.plugin(aggregatePaginate);
GrnHotelCityMapSchema.plugin(mongoosePaginate);
GrnHotelCityMapSchema.plugin(aggregatePaginate);
GrnCountryListSehema.plugin(mongoosePaginate);
GrnCountryListSehema.plugin(aggregatePaginate);
GrnLocationCityMapSchema.plugin(mongoosePaginate);
GrnLocationCityMapSchema.plugin(aggregatePaginate);
GrnLocationMasterSchema.plugin(mongoosePaginate);
GrnLocationMasterSchema.plugin(aggregatePaginate);
TboHotelCityListSchema.plugin(mongoosePaginate);
TboHotelCityListSchema.plugin(aggregatePaginate);
combineHotelCityListSchema.plugin(mongoosePaginate);
combineHotelCityListSchema.plugin(aggregatePaginate);

const GrnCityList = mongoose.model("grnCityList", GrnCityListSchema);
const GrnHotelCityMap = mongoose.model(
  "grnHotelCityMap",
  GrnHotelCityMapSchema
);

const GrnLocationCityMap = mongoose.model(
  "grnLocationCityMap",
  GrnLocationCityMapSchema
);

const GrnLocationMaster = mongoose.model(
  "grnLocationMaster",
  GrnLocationMasterSchema
);

const TboHotelCityList = mongoose.model(
  "tboHotelCityList",
  TboHotelCityListSchema
);

const GrnHotelBooking= mongoose.model("agentGrnHotelBookingDetail", grnHotelBookingDetailSchema);
const GrnCountryList=mongoose.model("grnCountryList",GrnCountryListSehema);


const CombineHotelCityList = mongoose.model("combineHotelCityList", combineHotelCityListSchema);

module.exports = { GrnCityList, GrnHotelCityMap,GrnCountryList,GrnHotelBooking, GrnLocationCityMap ,GrnLocationMaster, TboHotelCityList,CombineHotelCityList};
