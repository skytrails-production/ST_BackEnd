const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { internationl } = require("../../model/international.model");
const status = require("../../enums/status");
const resolveStatus = require("../../enums/errorType");
const moment = require("moment");
const transactionStatus = require("../../enums/paymentStatus");
const { differenceInYears } = require("date-fns");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const whatsApi = require("../../utilities/whatsApi");
const bookingStatus = require("../../enums/bookingStatus");
const AdminNumber = process.env.ADMINNUMBER;
const applyType = require("../../enums/passportEnquiryType");

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
      dob,
      passportNumber,
      issuedDate,
      expiryDate,
      type,
    } = req.body;
    let img = [];
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND});
    }
    if (type === applyType.RENEW) {
      const requiredFields = { passportNumber, issuedDate, expiryDate };
      const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
      if (missingFields.length > 0) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest, // Corrected status code to reflect an error
          responseMessage: responseMessage.MISSING_FIELDS, // You might want to define this in your response messages
          result: `${missingFields.join(", ")} are required.`,
        });
      }
    }
    // Calculate age from dob
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    // Ensure images are uploaded
    if (req.file||req.files.length >= 1) {
      for (var image of req.files) {
        const secureUrl = await commonFunction.getPassPortImageUrlAWS(image);
        img.push(secureUrl);
      }
    }
    req.body.userId=isUserExist._id;
    req.body.document = img;
    req.body.age = age;
    const result = await createUserPassportEnquiry(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
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
    return next(error);
  }
};
exports.deletePassportEnquiry = async (req, res, next) => {
  try {
    const { queryId } = req.query;
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
    const deletedData = await deleteUserPassportEnquiry({ _id: result._id });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result: deletedData,
    });
  } catch (error) {
    return next(error);
  }
};

exports.createPasportEnquiry = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      gender,
      dob,
      passportNumber,
      issuedDate,
      expiryDate,
      type,
      via
    } = req.body;
    let img = [];
    if (type === applyType.RENEW) {
      const requiredFields = { passportNumber, issuedDate, expiryDate };
      const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
      if (missingFields.length > 0) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest, // Corrected status code to reflect an error
          responseMessage: responseMessage.MISSING_FIELDS, // You might want to define this in your response messages
          result: `${missingFields.join(", ")} are required.`,
        });
      }
    }
    // Calculate age from dob
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    // Ensure images are uploaded
    if (req.file||req.files.length >= 1) {
      for (var image of req.files) {
        const secureUrl = await commonFunction.getPassPortImageUrlAWS(image);
        img.push(secureUrl);
      }
    }
    req.body.via='AGENT'
    req.body.document = img;
    req.body.age = age;
    const result = await createUserPassportEnquiry(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePassportEnquiry=async(req,res,next)=>{
  try {
    const { enquiryId,firstName,
      lastName,
      email,
      contactNumber,
      gender,
      dob,
      passportNumber,
      issuedDate,
      expiryDate,
      }=req.body;

      const result = await findUserPassportEnquiryData({
        _id: enquiryId,
        status: status.ACTIVE,
      });
      if (!result) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
          result: result,
        });
      }
      
      const updatedData=await updateUserPassportEnquiry({_id:result._id},req.body);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: updatedData,
      });

  } catch (error) {
   return next(error);
  }
}