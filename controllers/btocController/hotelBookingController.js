const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require('axios');
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const sendSMSUtils = require('../../utilities/sendSms');
const whatsApi=require("../../utilities/whatsApi")
const { userhotelBookingModelServices } = require('../../services/btocServices/hotelBookingServices');
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking,aggregatePaginateHotelBookingList } = userhotelBookingModelServices
exports.hotelBooking = async (req, res, next) => {
  try {
    const { name, email, address, BookingId, CheckInDate, HotelName, cityName, hotelId, noOfPeople, country, CheckOutDate, amount, room, phoneNumber, hotelName } = req.body;
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const bookingObject = {
      userId: isUserExist._id,
      name,
      email,
      address,
      bookingId: BookingId,
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
      const message = `Hello ${name}, Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login`;

      await sendSMS.sendSMSForHotelBooking(result);
      // await whatsApi.sendWhatsAppMessage(result.phone, message);
      await commonFunction.HotelBookingConfirmationMail(result);

      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_SUCCESS, result });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};



  exports.getAllHotelBookingList = async (req, res, next) => {
    try {
      const { page, limit, search, fromDate, toDate } = req.query;
      const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
      }
      const body={
        page,
        limit,
        search,
        fromDate,
        toDate,
        userId:isUserExist._id, 
      }
      const result = await aggregatePaginateHotelBookingList(body);
      if (result.docs.length == 0) {
        return res.status(statusCode.OK).send({statusCode: statusCode.OK, message: responseMessage.DATA_NOT_FOUND });
      }
      return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
      console.log("error=======>>>>>>", error);
      return next(error);
    }
  }

  exports.getUserHotelData = async (req, res, next) => {
    try {
      const isUserExist = await findUser({
        _id: req.userId,
        status: status.ACTIVE,
      });
      console.log("isUSerExist", isUserExist);
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
      }
      const result = await userhotelBookingModelList({ status: status.ACTIVE,userId:isUserExist._id,CheckInDate:-1});
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
      console.log("error: ", error);
      return next(error);
    }
  };

  exports.getUserHotelBookingById=async(req,res,next)=>{
    try {
      
    } catch (error) {
      console.log("Error======================",error);
      return next(error)
    }
  }