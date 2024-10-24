var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const whatsappAPIUrl = require("../utilities/whatsApi");
const userType = require("../enums/userType");
const status = require("../enums/status");
const Moment = require("moment");
//************SERVICES*************** */
const { userServices } = require("../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  deleteUser,
  userList,
  updateUser,
  countTotalUser,
  aggregatePaginateUser,
  aggregatePaginateUserList,
} = userServices;
const { ratingServices } = require("../services/ratingServices");
const {
  createRating,
  findRating,
  findRatingData,
  deleteRating,
  ratingList,
  ratingListPopulate,
  updateRating,
  paginateRatingSearch,
  countTotalRating,
} = ratingServices;
const { faqServices } = require("../services/faqServices");
const {
  createfaq,
  findfaq,
  findfaqData,
  deletefaqStatic,
  updatefaqStatic,
} = faqServices;

exports.rateOurApp = async (req, res, next) => {
  try {
    let { rate, comments, destination, section } = req.body;
   // Convert section to lowercase for uniformity
   if(section){
    section = section.toUpperCase();
   }
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const Positive = rate >= 3;
     let sectionIcon ;
     if (!sectionIcon) {
       switch (section) {
         case 'FLIGHTS':
           sectionIcon = 'flight_icon.png';
           break;
         case 'HOTELS':
           sectionIcon = 'hotel_icon.png';
           break;
         case 'BUSES':
           sectionIcon = 'car_icon.png';
           break;
         case 'HOLIDAYPACKAGE':
           sectionIcon = 'holiday_icon.png';
           break;
         default:
           sectionIcon = 'default_icon.png'; 
       }
     }
 
     // Construct rating object
     const object = {
       userId: isUserExist._id,
       userName: isUserExist.username,
       rate: rate,
       isPositive: Positive,
       comments: comments,
       destination,
       section,
       icon: sectionIcon,
     };
    const isRatingExist = await findRating({ userId: isUserExist._id,destination: { $exists: false} });
    if (isRatingExist) {
      const result = await updateRating({ _id: isRatingExist._id }, object);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.RATING_SUCCESS,
        result: result,
      });
    }

    const result = await createRating(object);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.RATING_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getRating = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result = await findRating({ userId: isUserExist._id });
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

exports.getAllRating = async (req, res, next) => {
  try {
    const result = await ratingList({});
    if (result.length < 1) {
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

exports.getCombineRatingFAQ = async (req, res, next) => {
  try {
    const rating = await ratingListPopulate({});
    if (rating.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const faqRes = await findfaqData({});
    if (faqRes.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const result = { rating, faqRes };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
