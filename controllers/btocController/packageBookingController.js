const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { internationl } = require("../../model/international.model");
const status = require("../../enums/status");
const moment = require('moment');
const transactionStatus=require("../../enums/paymentStatus");
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
  userPackageBookingServices,
} = require("../../services/btocServices/userPackageBookNowServices");
const {
  createPackageBookNow,
  findPackageBookNow,
  findPackageBookNowPopulate,
  getUserPackageBookNow,
  deletePackageBookNow,
  updatePackageBookNow,
  getPackageBookNowEnquiry,
  countTotalPackageBookNow,
} = userPackageBookingServices;
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
const { booking } = require("../universaltransfer.controller");
const {
  createUsertransaction,
  findUsertransaction,
  getUsertransaction,
  deleteUsertransaction,
  userUsertransactionList,
  updateUsertransaction,
  paginateUsertransaction,
  countTotalUsertransaction,
} = transactionModelServices;
//*************************************************API********************************************* */
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
    const isPackageExist = await internationl.findOne({ _id: packageId });
    const addition = Number(adults) + Number(child);
    const object = {
      packageId: isPackageExist._id,
      userId: isUserExist._id,
      email: email,
      fullName: fullName,
      contactNumber: { countryCode: countryCode, phone: phone },
      departureDate: departureDate,
      departureCity: departureCity,
      adults: adults,
      child: child,
      packageType: packageType,
      noOfPeople: addition,
    };
    const result = await createPackage(object);
    const notObject = {
      userId: isUserExist._id,
      title: "Holiday package Enquiry",
      description: `New package enquiry for ${isPackageExist.pakage_title} on our platform🙂`,
      from: "holidayEnquiry",
      to: fullName,
    };
    await createPushNotification(notObject);
    const contactNo = "+91" + phone;
    const url = `https://theskytrails.com/holidayInfo/${packageId}`;
    const populatedResult = await findPackagePopulate({ _id: result._id });
    await sendSMS.sendSMSPackageEnquiry(phone, fullName);
    await whatsApi.sendMessageWhatsApp(
      contactNo,
      fullName,
      url,
      "packagetem1_v3"
    );
    await whatsApi.sendWhatsAppMsgAdminPackage(
      AdminNumber,
      isPackageExist.pakage_title,
      "adminnotification"
    );
    await whatsApi.sendWhatsAppMsgAdmin(AdminNumber, "adminalert");
    await commonFunction.packageBookingConfirmationMail(populatedResult);
    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.CREATED_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    console.log("error in booking enquiry", error.message);
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
    const result = await getUserPackage({
      userId: isUserExist._id,
      status: status.ACTIVE,
    });
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
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

exports.getAllPackageEnquiry = async (req, res, next) => {
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
    console.log("Error while trying to get all packages", error);
    return next(error);
  }
};

exports.getPackageEnquiryById = async (req, res, next) => {
  try {
    // console.log("req.params.bookingId,===",req.params.bookingId,)
    const response = await findPackagePopulate({
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
    console.log("Error======================", error);
    return next(error);
  }
};

exports.queryResolved = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Error while update ");
  }
};

exports.packageBookNow = async (req, res, next) => {
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
      packageAmount,
      totalAmount,
      transactionId
    } = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isPackageExist = await internationl.findOne({ _id: packageId });
    if (!isPackageExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PACKAGE_NOT_EXIST,
      });
    }
    const isTransactionExist=await findUsertransaction({paymentId:transactionId,transactionStatus:transactionStatus.SUCCESS});
    if(!isTransactionExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.TRANSACTION_NOT_FOUND,
      });
    }
    const addition = Number(adults) + Number(child);
    const object = {
      packageId: isPackageExist._id,
      userId: isUserExist._id,
      email: email,
      fullName: fullName,
      contactNumber: { countryCode: countryCode, phone: phone },
      departureDate: departureDate,
      departureCity: departureCity,
      adults: adults,
      child: child,
      packageType: packageType,
      noOfPeople: addition,
      packageAmount:packageAmount,
      totalAmount:totalAmount,
      transactionId:transactionId
    };
    const result = await createPackageBookNow(object);
    const contactNo = result.contactNumber.countryCode+result.contactNumber.phone;
    const url = `https://theskytrails.com/holidayInfo/${packageId}`;
    await sendSMS.sendSMSPackageEnquiry(phone, fullName);
    await whatsApi.sendMessageWhatsApp(
      contactNo,
      fullName,
      url,
      "packagetem1_v3"
    );
    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PACKAGE_BOOKING_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    console.log("error in booking packages", error.message);
    return next(error);
  }
};

exports.getUserPackageBooking=async(req,res,next)=>{
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
     // Fetch all bookings of the user
     const userBookings = await getUserPackageBookNow({ userId: isUserExist._id });

     if (!userBookings || userBookings.length === 0) {
       return res.status(statusCode.OK).send({
         statusCode: statusCode.NotFound,
         responseMessage: responseMessage.USERS_NOT_FOUND,
       });
     }
     // Classify bookings based on departure date using Moment.js
    const currentDate = moment();
    const pastJourneys = [];
    const upcomingJourneys = [];
     userBookings.forEach((journey)=>{
      const departureDate = moment(booking.departureDate, 'DD-MM-YYYY');
      if (departureDate.isAfter(currentDate)) {
        pastJourneys.push(journey);
      } else {
        upcomingJourneys.push(journey);
      }
     });
     return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage:responseMessage.DATA_FOUND,
      pastJourneys,
      upcomingJourneys,
    });
  } catch (error) {
    console.log("error while trying to get booking",error);
    return next(error)
  }
}