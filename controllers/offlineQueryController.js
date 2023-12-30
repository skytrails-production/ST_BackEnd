const config = require("../config/auth.config");
const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const whatsappAPIUrl = require("../utilities/whatsApi");
const resolveStatus=require('../enums/errorType')
//***********************************SERVICES********************************************** */

const { userServices } = require("../services/userServices");
const userType = require("../enums/userType");
const status = require("../enums/status");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
} = userServices;
const { offlineServices } = require("../services/offlineQueryServices");
const { Console } = require("console");
const {
  createOffline,
  findOffline,
  deleteOffline,
  offlineList,
  updateOffline,
  paginateOfflineSearch,
  countTotalOffline,
} = offlineServices;

exports.createofflineQuery = async (req, res, next) => {
  try {
    const {
      email,
      contactNumber,
      origin,
      destination,
      message,
      queryType,
    } = req.body;
    const result = await createOffline(req.body);
    console.log("result=====", result);
    if (!result) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const otp="hello"
    // await sendSMS.sendSMSForSubAdmin(contactNumber,otp)
    const msg = `Dear user, thank you for reaching out to The SkyTrails support team. Your query has been submitted, and we will get back to you as soon as possible.`;
    await whatsappAPIUrl.sendWhatsAppMessage(contactNumber, msg);
    await commonFunction.senConfirmationQuery(email, contactNumber);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.QUERY_SUBMITTED,
      result: result,
    });
  } catch (error) {
    console.log("Error in creatring offline query", error);
    return next(error);
  }
};

exports.getOfflineQuery = async (req, res, next) => {
  try {
    const result = await offlineList({resolveStatus:resolveStatus.PENDING});
    if (!result) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error======", error);
    return next(error);
  }
};

// exports.updateOfflineQuery=async(req,res,next)=>{
//   try {
//     const {}=req.body;
//   } catch (error) {
//     console.log("error======",error);
//     return next(error)
//   }
// }

exports.updateOfflineQuery=async(req,res,next)=>{
  try {
    const {queryId}=req.body;
    const result=await updateOffline({_id:queryId},{resolveStatus:resolveStatus.RESOLVED});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.QUERY_RESOLVED,
      result: result,
    });
  } catch (error) {
    console.log("error=====",error);
    return next(error)
  }
}

