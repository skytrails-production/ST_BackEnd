const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bookingStatus=require('../../enums/bookingStatus')
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AdminNumber = process.env.ADMINNUMBER;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const sendSMSUtils = require("../../utilities/sendSms");
const whatsApi = require("../../utilities/whatsApi");

/**********************************SERVICES********************************************/
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
const {
  userGrnBookingModelServices,
} = require("../../services/btocServices/grnBookingServices");
const {
  createUserGrnBooking,
  findUserGrnBooking,
  findUserGrnBookingList,
  getUserGrnBooking,
  deleteUserGrnBooking,
  userGrnBooking,
  updateGrnBooking,
  paginateUserGrnBooking,
  countTotalUserGrnBooking,
  aggrPagiGrnBookingList,
} = userGrnBookingModelServices;
const {
  userGrnCancelServices,
} = require("../../services/btocServices/grnCancelServices");
const {
  createUserGrnCancellation,
  findUserGrnCancellation,
  findUserGrnCancellationList,
  deleteUserGrnCancellation,
  updateGrnCancellation,
  userGrnCancellation,
  getUserGrnCancellation,
} = userGrnCancelServices;

//******************************API's****************************************************/

exports.createUserGrnCancelRequest = async (req, res, next) => {
  try {
    const { reason, hotelBookingId } = req.body;
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
    const isBookingExist = await findUserGrnBooking({
      userId: isUserExist._id,
      _id: hotelBookingId,
    });
    if (!isBookingExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const isAlreadyRequested = await findUserGrnCancellation({
      userId: isUserExist._id,
      hotelBookingId: isBookingExist._id,
    });
    if (isAlreadyRequested) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.ALREADY_REQUESTED,
      });
    }
    const object = {
      userId: isUserExist._id,
      reason: reason,
      hotelBookingId: isBookingExist._id,
      bookingId: isBookingExist.booking_id,
      bookingReference: isBookingExist.booking_reference,
    };
    const result = await createUserGrnCancellation(object);
    const notObject = {
      userId: isUserExist._id,
      title: "Booking Cancelation Request by User",
      description: `New Cancel ticket request form user on our platform🎊.😒`,
      from: "HotelCancelRequest",
      to: isUserExist.userName,
    };
    await createPushNotification(notObject);
    const TemplateNames = [
      String(isUserExist.username),
      String(isUserExist.phone.mobile_number),
      String(reason),
    ];
  const sendTo = ["+919898989898",];
    const send=await whatsApi.sendWhtsAppAISensyMultiUSer(
      sendTo,
      TemplateNames,
      "cancelAlert"
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CANCEL_REQUEST_SEND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create cancel request", error);
    return next(error);
  }
};

exports.getGrnCancelRequests=async(req,res,next)=>{
  try {
    const result=await findUserGrnCancellationList({});
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CANCEL_REQUEST_SEND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get data",error);
    return next(error);
  }
};

exports.updateCancellation=async(req,res,next)=>{
  try {
    const {hotelBookingId,status}=req.body;
    const isBookingExist = await findUserGrnBooking({_id: hotelBookingId});
    if (!isBookingExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const updateCancellation=await updateGrnCancellation({_id:isBookingExist._id},{bookingStatus:status})
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result:updateCancellation
    });
  } catch (error) {
    console.log("error while trying to update data",error);
    return next(error);
  }
}