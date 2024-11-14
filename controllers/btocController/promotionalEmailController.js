const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const resolveStatus = require("../../enums/errorType");
const applyType = require("../../enums/passportEnquiryType");
const commonFunctions = require("../../utilities/commonFunctions");

/**********************************SERVICES********************************** */
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
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const sendSMSUtils = require("../../utilities/sendSms");
const {
  packageBookingModelServices,
} = require("../../services/btocServices/packageBookingServices");
const {
  createPackage,
  findPackage,
  findPackagePopulate,
  getUserPackage,
  deletePackage,
  updatePackage,
  countTotalPackage,
  getPackageEnquiry,
  findAllPackageEnquiryPopulate,
} = packageBookingModelServices;
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
  userPassportEnquiryServices,
} = require("../../services/btocServices/passportEnquiryServices");
const {
  createUserPassportEnquiry,
  findUserPassportEnquiryData,
  deleteUserPassportEnquiry,
  userPassportEnquiryList,
  userPassportEnquiryListSorted,
  updateUserPassportEnquiry,
  countTotalUserPassportEnquiry,
} = userPassportEnquiryServices;

const { booking } = require("../universaltransfer.controller");
const {promotionalEmailServices}=require("../../services/btocServices/promotionalEmailServices");
const {createPromotionaEmail,findPromotionaEmail,findPromotionaEmailList,deletePromotionaEmail,updatePromotionaEmail}=promotionalEmailServices;
//*************************************************API********************************************* */

exports.createPromotionalEmail = async (req, res, next) => {
  try {
    const {email}=req.body;
  const isRequestExist=await findPromotionaEmail({email: email});
  if(isRequestExist){
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.REQUEST_ALREADY_EXIST,
    });
  }
    const isUserExist = await findUser({ email: email });
    const obj={
        email,
    }
    if(isUserExist){
        obj.userId=isUserExist._id;
    }
    const userName = isUserExist?.username || "";
    const result=await createPromotionaEmail(obj);
    await commonFunctions.sendPromotionalEmailCofirmationMail(email,userName)
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.CREATED_SUCCESS,
        result: result,
      });
   } catch (error) {
    return next(error);
  }
};
exports.getAllPromotionalEmail = async (req, res, next) => {
  try {
    const result = await userPassportEnquiryListSorted({
      status: status.ACTIVE,
    });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};