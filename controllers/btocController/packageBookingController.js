const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const { internationl } = require("../../model/international.model");
const { SkyTrailsPackageModel } = require("../../model/holidayPackage.model")
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
  findAllPackageEnquiryPopulate
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
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }

    const isPackageExist = await SkyTrailsPackageModel .findOne({ _id: packageId });
    if(!isPackageExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PACKAGE_NOT_EXIST,
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
    };
    const result = await createPackage(object);
    const notObject = {
      userId: isUserExist._id,
      title: "Holiday package Enquiry",
      description: `New package enquiry for ${isPackageExist.title} on our platform🙂`,
      from: "holidayEnquiry",
      to: fullName,
    };
    await createPushNotification(notObject);
    const contactNo = "+91" + phone;
    const url = `https://theskytrails.com/holidaypackages/packagedetails?packageId=${packageId}`;
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
      isPackageExist.title,
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
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result = await getUserPackage({
      userId: isUserExist._id,
      status: status.ACTIVE,
    });
    if (!result) {
      return res.status(statusCode.OK).send({
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
    return next(error);
  }
};

exports.getAllPackageEnquiry = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await getPackageEnquiry(req.query);
    if (!result) {
      return res.status(statusCode.OK).send({
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
    return next(error);
  }
};

exports.getPackageEnquiryById = async (req, res, next) => {
  try {
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
    const isPackageExist = await SkyTrailsPackageModel.findOne({ _id: packageId });
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
    const url = `https://theskytrails.com/holidaypackages/packagedetails?packageId=${packageId}`;
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
      const departureDate = moment(journey.departureDate, 'DD-MM-YYYY');
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
    return next(error)
  }
}

exports.packageEnquiryListForCrm = async (req, res, next) => {
  try {
    const result = await findAllPackageEnquiryPopulate();
    if (result.length < 1) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }

    const mappedResult = result.map(item => {
      let inter_domes = '';
if (item.packageId.select_tags.some(tag => tag.domestic)) {
  inter_domes = 'Domestic';
} else {
  inter_domes = 'International';
}
      return {
        name: item.fullName,
        email: item.email,
        mobile_number: item.contactNumber.phone,
        from_date: item.departureDate,
        query_title: item.packageId.pakage_title,
        adults: item.adults,
        child: item.child,
        complete_package_cost: item.packageId.pakage_amount.amount,
        departure_City: item.departureCity,
        date_Of_journey: item.departureDate,
        isInternational: item.packageId.select_tags.some(tag => !tag.domestic && tag.international),
        inter_domes: inter_domes,
        destination: item.packageId.destination[0].addMore,
        country: item.packageId.country,
        createdAt:item.packageId.createdAt
      };
    });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: mappedResult,
    });
  } catch (error) {
    return next(error);
  }
};
