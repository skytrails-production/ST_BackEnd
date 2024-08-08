const mongoose = require("mongoose");


const flightschema =  new mongoose.Schema({

     flightNumber: {
        type: String,
        required: true,
    },
     flightName:{
        type: String,
        required: true,
    },
      flightDate:{
        type: Date,
        required: true,
     },
     price: {
      type: Number,
      required: true,
     },
     fareRule: {
        type: String,
        required: true,
      },
      cancellationCharge: {
        type: String,
        required: true,
      },
      baggage:{
        type: String,
        required: true,
      },

      
      flightCode:{
        type:String,
        required: true,
      }
   

});

module.exports = mongoose.model("flightInventory", flightschema);