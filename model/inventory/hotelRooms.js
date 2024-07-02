const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require('../../enums/status');
mongoose.pluralize(null);

const hotelRoomsSchema = new mongoose.Schema({
   hotelId:{type:mongoose.Types.ObjectId,ref:'hotelInventory'},
   hotelTitle:{type:String},
   description:{type:String},
   noOfAdult:{type:Number},
   noOfChild:{type:Number},
   roomType:{type:String},
   roomPrice:{type:Number},
   roomImages:[]
}, { timestamps: true });

hotelRoomsSchema.plugin(mongoosePaginate);
hotelRoomsSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('hotelRooms', hotelRoomsSchema);
