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
const {notificationServices}=require('../services/notificationServices')
const {createNotification,findNotification,findNotificationData,deleteNotification,updateNotification,countNotification}=notificationServices;


exports.createNotificationContent=async(req,res,next)=>{
    try {
        const {title,description,notificationType}=req.body;
        req.body.notificationType = notificationType.toLowerCase();
        if(req.file){
            req.body.image=await commonFunction.getNotificationImageUrlAWS(req.file);
        }
        const result=await createNotification(req.body);
        if(!result){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.CREATED_SUCCESS,
            result: result,
          });
    } catch (error) {
        return next(error)
    }
}

exports.getAllNotifications=async(req,res,next)=>{
    try {
        const result=await findNotificationData({isSend:false})
        if(!result){
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
        return next(error)
    }
}

