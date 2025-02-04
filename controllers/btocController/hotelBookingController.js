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

exports.hotelBooking = async (req, res, next) => {
  try {
    const {
      rating,
      imageUrl,
      roomName,
      mapUrl,
      address,
      bookingId,
      CheckInDate,
      hotelName,
      cityName,
      hotelId,
      country,
      CheckOutDate,
      amount,      
      refundable,
      room,
      paxes
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
      rating,
      imageUrl,
      roomName,
      mapUrl,
      address,
      bookingId,
      CheckInDate,
      hotelName,
      cityName,
      hotelId,
      country,
      CheckOutDate,
      amount,
      refundable,
      room,
      paxes
    };
    const result = await createUserhotelBookingModel(bookingObject);
    if (result) {
      const contactNo = "+91" + paxes[0].phoneNo;
      const url = `https://theskytrails.com/st-hotel`;
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
        String(paxes[0].firstName+paxes[0].lastName),
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
        statusCode: statusCode.NotFound,
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
        statusCode: statusCode.NotFound,
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
        statusCode: statusCode.NotFound,
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



//pdf generation tpo by _id
exports.getTboPdfGeneration = async (req, res , next ) =>  {
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

    await commonFunction.HotelBookingConfirmationMail(response);

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: "Pdf Generate successfully.",
      result: response,
    });
  } catch (error) {
    return next(error);
  }
};



//getCombineHotelBooking

exports.getCombineHotelBooking = async (req, res, next) => {

  try{
   
  const { page, limit, search, fromDate, toDate } = req.query;

  let result;
    const isUserExist = await findUser({
      _id :req.userId,
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



    // Fetch bookings from three sources concurrently

    // console.log(body,"data")
        const [tboResponse, grnResponse, ] = await Promise.all([
          aggregatePaginateHotelBookingList(body),
          aggrPagiGrnBookingList(body),
        ]);

        result={
          tbo:tboResponse.docs,
          grn:grnResponse.docs
        }

        // Safely destructure or assign default values for each response
    // const tbo = tboResponse && Array.isArray(tboResponse.docs) ? tboResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    // const grn = grnResponse && Array.isArray(grnResponse.docs) ? grnResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    
    // // Combine docs and total counts
    // result.docs = [tbo, grn];
    // result.totalDocs = tbo.totalDocs + grn.totalDocs;
    // result.totalTboPages = tbo.totalPages;
    // result.totalGrnPages = grn.totalPages;
    
        // Send the combined result back
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          result: {
            user: isUserExist._id,
            result
          },
        });
      } catch (error) {
        // Handle errors gracefully
        return next(error);
      }



}
