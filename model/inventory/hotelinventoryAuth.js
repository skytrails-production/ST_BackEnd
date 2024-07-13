const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const status = require("../../enums/status");
const userType=require("../../enums/userType")
const approveStatus = require("../../enums/approveStatus");

mongoose.pluralize(null);

const inventoryPartnerSchema = new mongoose.Schema({
  partnerId:{type:String},
  hotelName: { type: String },
  propertyType: { type: String },
  channelMngrName: { type: String },
  hotelCity: { type: String },
  managerName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  password:{type: String},
  balance: {
    type: Number,
    default: 0,
  },
  deviceToken: {
    type: String,
    default: "",
  },
  deviceType: { type: String },
  profilePic: {
    type: String,
    default: "",
  },
  reason: { type: String },
  bio:{type:String},
  approveStatus: {
    type: String,
    enum: [
      approveStatus.APPROVED,
      approveStatus.PENDING,
      approveStatus.REJECT,
    ],
    default: approveStatus.PENDING,
  },
  status: {
    type: String,
    enum: [status.ACTIVE, status.BLOCK, status.DELETE],
    default: status.ACTIVE,
  },
});
inventoryPartnerSchema.plugin(mongoosePaginate);
inventoryPartnerSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("hotelPartnerDetail", inventoryPartnerSchema);
