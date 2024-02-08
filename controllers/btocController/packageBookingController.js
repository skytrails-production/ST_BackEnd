const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const whatsApi = require("../../utilities/whatsApi");
const bookingStatus = require("../../enums/bookingStatus");
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
  getPackageEnquiry
} = packageBookingModelServices;

exports.packageBooking = async (req, res, next) => {
  try {
    const {
      packageId,
      email,
      fullName,
      countryCode,
      phone,
      departureCity,
      adults,
      child,
      packageType,
      departureDate,
      noOfPeople,
    } = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const addition=Number(adults)+Number(child);
    const object = {
      packageId: packageId,
      userId: isUserExist._id,
      email: email,
      fullName: fullName,
      contactNumber: { countryCode: countryCode, phone: phone },
      departureDate: departureDate,
      departureCity:departureCity,
      adults: adults,
      child: child,
      packageType: packageType,
      noOfPeople:addition
    };
    const result = await createPackage(object);
    const contactNo='+91'+phone
    const url=`https://theskytrails.com/holidayInfo/${packageId}`;
    const populatedResult=await findPackagePopulate({_id:result._id});
    await sendSMS.sendSMSPackageEnquiry(phone,fullName)
    await whatsApi.sendMessageWhatsApp(contactNo,fullName,url,'packagetem1_v3');
    await commonFunction.packageBookingConfirmationMail(populatedResult);
    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.CREATED_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    console.log("error in booking packages", error.message);
    return next(error);
  }
};

exports.getPackageBookigs = async (req, res, next) => {
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result=await getUserPackage({userId:isUserExist._id, status:status.ACTIVE})
    if(!result){
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.BUS_BOOKING_CREATED,
      result: result,
    });
  } catch (error) {
    console.log("error to get packages", error.message);
    return next(error);
  }
};

exports.getAllPackageEnquiry=async(req,res,next)=>{
  try {
    const { page, limit, search } = req.query;
    const result = await getPackageEnquiry(req.query);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to get all packages",error);
    return next(error)
  }
}

exports.getPackageEnquiryById=async(req,res,next)=>{
  try {
    console.log("req.params.bookingId,===",req.params.bookingId,)
    const response = await findPackagePopulate({
      _id: req.params.bookingId,
    });
    if (!response) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: response,
      });
  } catch (error) {
    console.log("Error======================", error);
    return next(error);
  }
}