const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
const userType = require("../../enums/userType");
const authType = require("../../enums/authType");
const { object } = require("joi");
mongoose.pluralize(null);
const subAdminTaskSchema = new mongoose.Schema(
  {
    authType: {
      type: String,
      enum: [
        authType.ADS_HANDLER,
        authType.PACKAGE_HANDLER,
        authType.REQUEST_HANDLER,
        authType.BOOKING_MANAGER,
        authType.CUSTOMER_SUPPORT,
        authType.CONTENT_MANAGER,
        authType.FINANCIAL_SUBADMIN,
        authType.USER_MANAGER,
        authType.MARKETING_PROMOTIONS,
        authType.ANALYTICS_SUBADMIN,
        authType.VISA_PROCESSING,
        authType.SECURITY_COMPLIANCE,
        authType.LOCALIZATION_TRANSLATION,
      ],
    },
    task:{},
    status: {
      type: String,
      default: status.ACTIVE,
    },
    userType: {
      type: String,
      // enum: [userType.SUBADMIN, userType.ADMIN],
      default: userType.SUBADMIN,
    },
  },
  { timestamps: true }
);
subAdminTaskSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subAdminTask", subAdminTaskSchema);
