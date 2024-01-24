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
  userflightBookingServices,
} = require("../../services/btocServices/flightBookingServices");
const { aggregatePaginate } = require("../../model/role.model");
const {
  createUserflightBooking,
  findUserflightBooking,
  getUserflightBooking,
  findUserflightBookingData,
  deleteUserflightBooking,
  userflightBookingList,
  updateUserflightBooking,
  paginateUserflightBookingSearch,
  aggregatePaginateGetBooking,
} = userflightBookingServices;

exports.flighBooking = async (req, res, next) => {
  try {
    const data = { ...req.body };
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
    data.userId = isUserExist._id;
    data.bookingStatus = bookingStatus.BOOKED;
    // const passengerDetails = data.passengerDetails || [];
    // const modifiedPassengers = [];
    // for (let i = 0; i < passengerDetails.length; i++) {
    //   const passenger = passengerDetails[i];
    //   if (passenger.gender === 1) {
    //     passenger.gender = 'MALE';
    //   } else if (passenger.gender === 2) {
    //     passenger.gender = 'FEMALE';
    //   } else if (passenger.gender === 3) {
    //     passenger.gender = 'OTHER';
    //   }
    //   modifiedPassengers.push(passenger);
    // }
    // const object = {
    //   bookingId: data.bookingId,
    //   oneWay: data.oneWay,
    //   pnr: data.pnr,
    //   origin: data.origin,
    //   destination: data.destination,
    //   paymentStatus: data.paymentStatus,
    //   dateOfJourney: data.dateOfJourney,
    //   amount: data.amount,
    //   userId: isUserExist._id,
    //   airlineDetails: airlineDetails,
    //   passengerDetails: modifiedPassengers,
    // };

    const result = await createUserflightBooking(data);
    const userName = `${data?.passengerDetails[0]?.firstName} ${data?.passengerDetails[0]?.lastName}`;
    const url1 = `contactus`;
    const phone = data?.passengerDetails[0]?.ContactNo;
    const message = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details: https://theskytrails.com/${url1}`;
    // await whatsApi.sendWhatsAppMessage(phone, message);
    await sendSMSUtils.sendSMSForFlightBooking(data);
    await commonFunction.FlightBookingConfirmationMail(result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK, 
      message: responseMessage.FLIGHT_BOOKED,
      result,
    });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

exports.getUserflightBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    console.log("======",isUserExist)
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
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
    const result = await aggregatePaginateGetBooking(body);
    console.log("result=========", result);
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
    console.log("error: ", error);
    return next(error);
  }
};

exports.getUserFlightData = async (req, res, next) => {
  try {
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
    const result = await findUserflightBookingData({ status: status.ACTIVE,userId:isUserExist._id });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.BOOKING_NOT_FOUND,
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


exports.sendPDF=async(req,res,next)=>{
  try {
    const {ticketId,email}=req.body;
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
    const result=await findUserflightBooking({_id:ticketId});
    console.log("==================",result)
    await commonFunction.FlightBookingConfirmationMailWithNewEmail(result,email);
    return res
    .status(statusCode.OK)
    .send({statusCode:statusCode.OK, message: responseMessage.PDF_SENT});
    
  } catch (error) {
    console.log("error while send mail!",error);
    return next(error)
  }
}