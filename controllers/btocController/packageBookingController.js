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
  getUserPackage,
  deletePackage,
  updatePackage,
  countTotalPackage,
} = packageBookingModelServices;

exports.packageBooking = async (req, res, next) => {
  try {
    const {
      pakageid,
      email,
      fullName,
      contryCode,
      phone,
      departureCity,
      adults,
      child,
      selectRoom,
      checkIndate,
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
    const object = {
      pakageid: pakageid,
      userId: isUserExist._id,
      email: email,
      fullName: fullName,
      contactNumber: { contryCode: contryCode, phone: phone },
      departureCity: departureCity,
      adults: adults,
      child: child,
      selectRoom: selectRoom,
      checkIndate: checkIndate,
    };
    const result = await createPackage(object);
    const message = `Hello ${fullName} ,Thank you for booking your package stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login`;
    // await sendSMS.sendSMSBusBooking(result.contactNumber.phone, userName);
    await whatsApi.sendWhatsAppMessage(result.contactNumber.phone, message);
    // await commonFunction.packageBookingConfirmationMail(result);

    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.BUS_BOOKING_CREATED,
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
