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
const {packageBannerServices}=require('../services/packageBannerServices');
const {createPackageBanner,findPackageBanner,findPackageBannerData,deletePackageBanner,updatePackageBanner}=packageBannerServices;
const{popularDestinationServices}=require('../services/popularDestinationServices');
const{createPopularDestination,findPopularDestination,findPopularDestinationData,deletePopularDestination,updatePopularDestination}=popularDestinationServices;



//*******************************All apis */
exports.getPackageBanner=async(req,res,next)=>{
    try {
        const result=await findPackageBannerData({status:status.ACTIVE});
        if(result.length==0){
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
        console.log("Error while trying to get package banner", error);
    return next(error);
    }
}

exports.getPopularDestination=async(req,res,next)=>{
    try {
        const result=await findPopularDestinationData({})
        if(result.length==0){
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
        console.log("Error while trying to get popular destination", error);
    return next(error);
    }
}