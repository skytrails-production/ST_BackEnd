const mongoose = require("mongoose");

const forexWithme = mongoose.model(
  "forexWithme",
  new mongoose.Schema(
    {
        enterCity:{
            type: String,
            required: true,
         },
         enterLocation:{
            type: String,
            required:[true,"enter Location"],
         },
         services:{
            type: String,
            enum:["Domestic","International"],
            required: [true,"please select services"],
         },
         amount:{
            type: String,
            required: [true,"please  enter amount"],
         },
         currency:{
            type: String,
            enum:['INR','USD','EUR'],
            required: [true,"please enter currency"],
         },
         commissionType:{
            type: String,
            required: [true,"please enter completion type"],
         },
         mobile:{
            type: String,
            required: [true,"please enter mobile"]
         }
    },
    {
      timestamps: true,
    }
  )
);


const forexWithcustomer = mongoose.model(
    "forexWithcustomer",
    new mongoose.Schema(
      {
          name:{
              type: String,
              required: true,
           },
           mobile:{
            type: String,
            required: [true,"please enter mobile"]
         },
           service:{
              type: String,
              enum:["Domestic","International"],
              required: [true,"please select service"],
           },
           amount:{
              type: String,
              required: [true,"please  enter amount"],
           },
           currency:{
              type: String,
              enum:['INR','USD','EUR'],
              required: [true,"please enter currency"],
           },
           commissionType:{
              type: String,
              required: [true,"please enter completion type"],
           },
           myCommission:{
            type: String,
            required: [true,"please enter completion type"],
         },
          
      },
      {
        timestamps: true,
      }
    )
  );

module.exports = {forexWithme,forexWithcustomer};
