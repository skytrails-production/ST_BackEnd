const mongoose = require("mongoose");

const visadata = mongoose.model(
  "visadata",
  new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
         },
         email:{
            type: String,
            required:[true,"enter email"],
         },
         mobile:{
            type: String,
            required: [true,"please select mobile number"],
         },
         visaType:{
            type: String,
            required: [true,"please  enter visa type"],
         }
    },
    {
      timestamps: true,
    }
  )
);


module.exports = visadata;