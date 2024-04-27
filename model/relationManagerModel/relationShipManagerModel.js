const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
const userType=require("../../enums/userType");
const authType=require("../../enums/authType");
const { object } = require("joi");
mongoose.pluralize(null);
const subAdminSchema = new mongoose.Schema(
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
    city:{type: String},
    
  },
  { timestamps: true }
);
subAdminSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subAdmins", subAdminSchema);
