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
        enum:[userType.SUBADMIN,userType.ADMIN],
        default:userType.SUBADMIN
    },
    authType:{
        type: String,
        enum:[authType.ADS_HANDLER,authType.PACKAGE_HANDLER,authType.REQUEST_HANDLER,authType.AGENT_MANAGER,authType.BOOKING_MANAGER,authType.EVENT_HANDLER,authType.CONTENT_MANAGER,authType.CUSTOMER_SUPPORT,authType.REQUEST_HANDLER,authType.FINANCIAL_SUBADMIN,authType.VISA_PROCESSING,authType.USER_MANAGER,authType.COUPON_CODE_HANDLER],
    },
    // task:[],
    dynamicProperties: {
      type: Map, // Using a Map for key-value pairs
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);
subAdminSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subAdmins", subAdminSchema);
