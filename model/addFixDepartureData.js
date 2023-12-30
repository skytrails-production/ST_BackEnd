const mongoose=require('mongoose');

const FixDepartureModal=new mongoose.Schema({
    Sector:{
        type:String,
    },
    DepartureDate :{
        type: String,
    },
    ReturnDate :{
        type: String,
    },
    Airlines :{
        type : String,
    },
    FlightNo :{
        type :Number,
    },
    OnwardTime: {
        type :String,
    },
    ReturnTime : {
        type :String,
    },
    Price :{
        type :Number,
    },
    Hold: {
        type: Number,
    },
    AvailableSeats :{
        type:Number,
    },
    AirTKT :{
        type:String,
    },
    AIRPKG :{
        type :String,
    },
},
{
    timestamps: true,
  }
)


module.exports=mongoose.model('fixdepartures', FixDepartureModal);