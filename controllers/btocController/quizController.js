const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const status=require('../../enums/status')
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');
const admin = require("firebase-admin");
const FCM=require('fcm-node');
const axios=require('axios')
const { google } = require('googleapis');
// Define the required scopes for the Google API you are using
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// const fcmKey="Kvo8qhR8xvB0Wd1fElU0-sUhMSg6akkCRZVhWiwEZVs";
// const serviceAccount="AIzaSyAsGxfAYsGpKBN86JzGI38Wd9JjbrK4dxU"
// const fcm=new FCM(fcmKey)
//Essential Services***************************************************
const {quizServices}=require("../../services/btocServices/quizServices");
const {createQuizContent,findQuizContent,findQuizData,deleteQuiz,updateQuiz,createQuizResponseContent,findQuizResponseContent,findQuizResponseData,deleteQuizResponse,updateQuizResponse}=quizServices;
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;

// exports.createDailyQuiz=async(req,res,next)=>{
//     try {
//         const {question,answer,options}=req.body;
        

//     } catch (error) {
//         console.log("error while trying to create daily quiz",error);
//         return next(error);
//     }
// }

exports.getDailyQuiz=async(req,res,next)=>{
    try {
        const result=await findQuizContent({status:status.ACTIVE});
        if(!result){
        return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND});
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.RESPONSE_SUBMIT,result:result});
    } catch (error) {
        console.log("error while trying to create daily quiz",error);
        return next(error);
    }
};

exports.submitDailyQuizResponse=async(req,res,next)=>{
    try {
        const {questionId,answer}=req.body;
        const isUserExist = await findUser({
            _id: req.userId,
            status: status.ACTIVE,
          });
          if (!isUserExist) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.USERS_NOT_FOUND,
            });}
        const isQuestionExist=await findQuizContent({_id:questionId,status:status.ACTIVE});
        if (!isQuestionExist) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.DATA_NOT_FOUND,
            });}
           const isresponseExist=await findQuizResponseContent({user:isUserExist._id})
            if(isresponseExist){
                return res.status(statusCode.OK).send({
                    statusCode: statusCode.Conflict,
                    responseMessage: responseMessage.ALREADY_RESPOND,
                  });
            }
        const object={
            user:isUserExist._id,
            questionId:isQuestionExist._id,
            question:isQuestionExist.question,
            answer:answer
        }
        const result=await createQuizResponseContent(object);
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.RESPONSE_SUBMIT,result:result});
    } catch (error) {
        console.log("error while trying to create daily quiz",error);
        return next(error);
    }
};

