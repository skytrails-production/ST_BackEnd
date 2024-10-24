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
const whatsApi = require("../../utilities/whatsApi");
const {
  userhotelBookingModelServices,
} = require("../../services/btocServices/hotelBookingServices");
const {
  createUserhotelBookingModel,
  findUserhotelBookingModel,
  getUserhotelBookingModel,
  deleteUserhotelBookingModel,
  userhotelBookingModelList,
  updateUserhotelBookingModel,
  paginateUserhotelBookingModelSearch,
  countTotalhotelBooking,
  aggregatePaginateHotelBookingList,
} = userhotelBookingModelServices;
exports.hotelBooking = async (req, res, next) => {
  try {
    const {
      name,
      email,
      address,
      bookingId,
      CheckInDate,
      HotelName,
      cityName,
      hotelId,
      noOfPeople,
      country,
      CheckOutDate,
      amount,
      room,
      phoneNumber,
      hotelName,
    } = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const bookingObject = {
      userId: isUserExist._id,
      name,
      email,
      address,
      bookingId: bookingId,
      CheckInDate,
      hotelName: HotelName,
      cityName,
      hotelId,
      noOfPeople,
      country,
      CheckOutDate,
      amount,
      room,
      phone: phoneNumber,
      hotelName,
    };
    const result = await createUserhotelBookingModel(bookingObject);
    if (result) {
      const contactNo = "+91" + phoneNumber;
      const url = `https://theskytrails.com/hotel`;
      const notObject = {
        userId: isUserExist._id,
        title: "Hotel Booking by User",
        description: `New Hotel booking by user on our platform🎊.🙂`,
        from: "hotelBooking",
        to: isUserExist.userName,
      };
      const createdData = await createPushNotification(notObject);
      let options = { day: "2-digit", month: "2-digit", year: "numeric" };
      // Format the date using the toLocaleDateString() function
      let formattedDate = new Date().toLocaleDateString("en-GB", options);
      const TemplateNames = [
        String(notObject.from),
        String(createdData.bookingId),
        String(notObject.to),
        String(formattedDate),
      ];
      await whatsApi.sendWhtsAppOTPAISensy(
        AdminNumber,
        TemplateNames,
        "admin_booking_Alert"
      );
      const checkin = new Date(CheckInDate);
      const template = [
        String(name),
        String(hotelName),
        String(bookingId),
        String(hotelName),
        String(
          checkin.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        String(room),
        String(checkin.toLocaleDateString("en-GB", options)),
      ];
      await whatsApi.sendWhtsAppOTPAISensy(contactNo, template, "bookingHotel");
      await sendSMS.sendSMSForHotelBooking(result);
      // await whatsApi.sendMessageWhatsApp(contactNo, name, url, "hotel");

      // await whatsApi.sendWhatsAppMsgAdmin(AdminNumber, "adminbooking_alert");
      // await whatsApi.sendWhatsAppMsgAdmin(AdminNumber, "adminalert");
      await commonFunction.HotelBookingConfirmationMail(result);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.BOOKING_SUCCESS,
        result,
      });
    }
  } catch (error) {
    return next(error);
  }
};
exports.getAllHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const result = await aggregatePaginateHotelBookingList(body);
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};
exports.getUserHotelData = async (req, res, next) => {
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result = await userhotelBookingModelList({
      status: status.ACTIVE,
      userId: isUserExist._id,
      CheckInDate: -1,
    });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};
exports.getUserHotelBookingById = async (req, res, next) => {
  try {
    const response = await findUserhotelBookingModel({
      _id: req.params.bookingId,
    });
    if (!response) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: response,
    });
  } catch (error) {
    return next(error);
  }
};
