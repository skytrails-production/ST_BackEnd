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
const{userServices}=require("../services/userServices");
const {createUser,findUser,getUser,findUserData,deleteUser,userList,updateUser,countTotalUser,aggregatePaginateUser,aggregatePaginateUserList}=userServices;
const {ratingServices}=require("../services/ratingServices");
const { log } = require("console");
const {createRating,findRating,findRatingData,deleteRating,ratingList,updateRating,paginateRatingSearch,countTotalRating}=ratingServices;

exports.rateOurApp=async(req,res,next)=>{
    try {
        const {rate,comments}=req.body;
        let Positive;
        const isUserExist = await findUserData({ _id: req.userId });
        if(!isUserExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.USERS_NOT_FOUND,
              });
        }
        if(rate<3){
            Positive=false
        }else{
            Positive=true
        }
        const object={
            userId:isUserExist._id,
            userName:isUserExist.username,
            rate:rate,
            isPositive:Positive,
            comments:comments
        }
        const isRatingExist=await findRating({userId:isUserExist._id});
        if(isRatingExist){
            const result=await updateRating({_ID:isRatingExist._id},object);
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.RATING_SUCCESS,
                result: result,
              });
        }
       
        const result=await createRating(object);
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.RATING_SUCCESS,
            result: result,
          });
    } catch (error) {
        console.log("error while trying to rate our app",error);
        return next(error);
    }
}

exports.getRating=async(req,res,next)=>{
    try {
        const isUserExist = await findUserData({ _id: req.userId });
        if(!isUserExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.USERS_NOT_FOUND,
              });
        }
        const result=await findRating({userId:isUserExist._id});
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
        console.log("error while tring to get rate",error);
        return next(error)
    }
}

exports.getAllRating=async(req,res,next)=>{
    try {
        const result=await ratingList({});
        console.log("result",result);
        if(result.length<1){
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
        console.log("error while tring to get rate",error);
        return next(error)
    }
}