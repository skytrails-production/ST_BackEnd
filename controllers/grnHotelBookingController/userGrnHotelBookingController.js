const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
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

//******************************API's****************************************************/

exports.grnUserHotelBooking = async (req, res, next) => {
  try {
    let data = { ...req.body };
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
      data.userId=isUserExist._id;
    const result = await createUserGrnBooking(data);
    const notObject = {
      userId: isUserExist._id,
      title: "Hotel Booking by User",
      description: `New Hotel booking by user on our platform🎊.🙂`,
      from: "hotelBooking",
      to: isUserExist.userName,
    };
    let options = { day: "2-digit", month: "2-digit", year: "numeric" };
    // Format the date using the toLocaleDateString() function
    let formattedDate = new Date().toLocaleDateString("en-GB", options);
    const TemplateNames = [
      String(notObject.from),
      String(data.booking_id),
      String(notObject.to),
      String(formattedDate),
    ];
    await whatsApi.sendWhtsAppOTPAISensy(
      AdminNumber,
      TemplateNames,
      "admin_booking_Alert"
    );
    const checkin = new Date(data.checkin);
    const template = [
      String(data.holder.name),
      String(data.hotel.name),
      String(data.booking_id),
      String(data.hotel.name),
      String(
        checkin.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      String(data.hotel.rooms.length),
      String(checkin.toLocaleDateString("en-GB", options)),
    ];
    await whatsApi.sendWhtsAppOTPAISensy('+91'+data.holder.phone_number, template, "bookingHotel");
    const smsdata={
      phone:data.holder.phone_number,
      name:data.holder.name
    }
    await sendSMS.sendSMSForHotelBooking(smsdata);
    await commonFunction.grnHotelBookingConfirmationMailWithPdf(result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.BOOKING_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getUserGrnBooking=async(req,res,next)=>{
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
    const result=await findUserGrnBookingList({status: status.ACTIVE,userId: isUserExist._id})
    if (result.length<1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({ responseMessage: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
}

exports.getUserGrnBookingById=async(req,res,next)=>{
  try {
    const{bookingId}=req.body;
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
    const result=await findUserGrnBooking({_id:bookingId});
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({ responseMessage: responseMessage.DATA_FOUND, result: result });
   } catch (error) {
    return next(error);
  }
}

exports.getAllGrnBookingList=async(req,res,next)=>{
  try {
    const result=await userGrnBooking({status: status.ACTIVE});
    if (result.length<1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({ responseMessage: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
}