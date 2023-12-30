const mongoose=require('mongoose');
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const FixDepartureBookingModal=new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "userb2bs",
    },
    flightId:{
        type:Schema.Types.ObjectId,
        ref:"fixdepartures",
    },
    Sector :{
      type:String,
    },
    DepartureDate :{
      type:String,
    },
    ReturnDate :{
      type:String
    },
    Airlines :{
      type:String,
    },
    FlightNo :{
      type:Number,
    },
    OnwardTime :{
      type:String,
    },
    ReturnTime :{
      type:String,
    },
    loginName :{
        type: String,
    },
    numberOfSeats :{
        type: Number,
    },
    phoneNo :{
        type : Number,
    },
    soldTo :{
        type :String,
    },
    status: {
        type :String,
    },
    emailId : {
        type :String,
    },
    finalSalePrice :{
        type :Number,
    },
    names: {
        type: [
          {
            title:{
                type:String,
            },
            firstName: {
              type: String,
            },
            lastName: {
              type: String,
            },
            passport: {
                type: String,
              },
              passportExpiry: {
                type: String,
              },
          },
        ],
      },
       
},
{
    timestamps: true,
  }
)

FixDepartureBookingModal.plugin(mongoosePaginate);
FixDepartureBookingModal.plugin(aggregatePaginate)
module.exports=mongoose.model('fixdeparturebookings', FixDepartureBookingModal);