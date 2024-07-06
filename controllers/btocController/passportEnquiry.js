const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { internationl } = require("../../model/international.model");
const status = require("../../enums/status");
const resolveStatus = require("../../enums/errorType");
const moment = require("moment");
const transactionStatus = require("../../enums/paymentStatus");
const { differenceInYears } = require('date-fns');
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const whatsApi = require("../../utilities/whatsApi");
const bookingStatus = require("../../enums/bookingStatus");
const AdminNumber = process.env.ADMINNUMBER;
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

//*************************************************API********************************************* */

exports.createEnquiry = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      gender,
      dob
    } = req.body;
    let img = [];
    // console.log("req===============",req.files)
 // Calculate age from dob
 const birthDate = new Date(dob);
 const currentDate = new Date();
 let age = currentDate.getFullYear() - birthDate.getFullYear();
 const monthDiff = currentDate.getMonth() - birthDate.getMonth();
 if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
   age--;
 }
    // Ensure images are uploaded
    if (req.files.length > 1) {
      for (var image of req.files) {
        const secureUrl = await commonFunction.getPassPortImageUrlAWS(image);
        img.push(secureUrl);
      }
    }
    
    req.body.document = img;
    req.body.age = age;
    const result = await createUserPassportEnquiry(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to create enquiry!", error);
    return next(error);
  }
};

exports.getAllPassportEnquiry = async (req, res, next) => {
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
    console.log("error while trying to get all passport enquiry list", error);
    return next(error);
  }
};
exports.getPassportEnquiry = async (req, res, next) => {
  try {
    const { queryId } = req.query;
    // const isUserExist = await findUser({
    //     _id: req.userId,
    //     status: status.ACTIVE,
    //   });
    // if (!isUserExist) {
    //     return res
    //       .status(statusCode.NotFound)
    //       .send({
    //         statusCode: statusCode.NotFound,
    //         responseMessage: responseMessage.USERS_NOT_FOUND,
    //       });
    //   }
    const result = await findUserPassportEnquiryData({
      _id: queryId,
      status: status.ACTIVE,
    });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get all passport enquiry list", error);
    return next(error);
  }
};
exports.updateResolveStatus = async (req, res, next) => {
  try {
    const { queryId } = req.query;
    const isExist = await findUserPassportEnquiryData({
      _id: queryId,
      resolveStatus: resolveStatus.PENDING,
    });
    if (!isExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.NOT_FOUND,
      });
    }
    const result = await updateUserPassportEnquiry(
      { _id: isExist._id },
      { resolveStatus: resolveStatus.RESOLVED }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to update status", error);
    return next(error);
  }
};
