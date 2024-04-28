const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const userType=require("../../enums/userType");
mongoose.pluralize(null);
const relManagerSchema = new mongoose.Schema(
  {
    reportingManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'subAdmins'
    },
    userName:{
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    password:{
      type:String
    },
    status: {
      type: String,
      default: status.ACTIVE,
    },
    userType:{
        type: String,
        enum:[userType.RM],
        default:userType.RM
    },
    addressDetails:{
        city:{type: String},
        pincode:{type: String},
        state:{type: String},
        country:{type: String}
    }
  },
  { timestamps: true }
);
relManagerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("relationshipManagers", relManagerSchema);
