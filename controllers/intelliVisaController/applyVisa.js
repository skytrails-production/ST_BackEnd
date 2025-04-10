const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AdminNumber = process.env.ADMINNUMBER;
const sendSMSUtils = require("../../utilities/sendSms");
const whatsApi = require("../../utilities/whatsApi");
const commonFunction = require("../../utilities/commonFunctions");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");

/**********************************SERVICES********************************** */
const {
  pushNotificationServices,
} = require("../../services/pushNotificationServices");
const {
  createPushNotification,
  findPushNotification,
  findPushNotificationData,
  deletePushNotification,
  updatePushNotification,
  countPushNotification,
} = pushNotificationServices;
const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification,
  pushNotification1,
  pushNotificationAfterDepricate,
} = require("../../utilities/commonFunForPushNotification");
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const {visaCountryServices}=require('../../services/intelliVisaServices/visaCountryService');
const{createCountryList,findCountry,deleteCountryList,countryList,updatecountryList,countTotalcountryList}=visaCountryServices
const {visaBookingServices}=require('../../services/intelliVisaServices/applyAiVisaServices');
const {createvisaBooking,findVisaBooking,findOneVisaBookingPop,deleteVisaBooking,visaBookingList,visaBookingListPop,updateVisaBooking,countTotalVisaBooking}=visaBookingServices;

exports.visaApplicationsReg = async (req, res, next) => {
  try {
    const { firstName, lastName, email, sex, mobileNumber, address, depCountyName, arrCountyName, fromDate, toDate, visaType, fee } = req.body;
    const result=await createvisaBooking(req.body);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.getVisaApplications=async(req,res,next)=>{
    try {
        const result=await visaBookingList();
        if(result.length<1){
            return res
            .status(statusCode.OK)
            .send({ statusCode:statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND, result: result });
        }
        return res
      .status(statusCode.OK)
      .send({ statusCode:statusCode.OK,responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

