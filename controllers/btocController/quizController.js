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
const moment = require('moment');
const Quiz=require("../../model/btocModel/quizModel")
// Define the required scopes for the Google API you are using
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// const fcmKey="Kvo8qhR8xvB0Wd1fElU0-sUhMSg6akkCRZVhWiwEZVs";
// const serviceAccount="AIzaSyAsGxfAYsGpKBN86JzGI38Wd9JjbrK4dxU"
// const fcm=new FCM(fcmKey)
//Essential Services***************************************************
const {quizServices}=require("../../services/btocServices/quizServices");
const {createQuizContent,findQuizContent,findQuizData,findWinnerlastday,deleteQuiz,updateQuiz,createQuizResponseContent,findQuizResponseContent,findQuizResponseContentPop,findQuizResponseData,deleteQuizResponse,updateQuizResponse}=quizServices;
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

//**********************************API***********************************************/

exports.getDailyQuiz1=async(req,res,next)=>{
    try {
        const currentDate=new Date();
        // quizDate:{$gte:currentDate}
        const result=await findQuizContent({status:status.ACTIVE,quizExpiration:{$gt:currentDate}});
        if(result){
        // return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND});
        const getDate=moment(currentDate).format("YYYY-MM-DD")
        const getDateExp=moment(result.quizExpiration).format("YYYY-MM-DD");
        if(getDateExp>getDate){
            return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.QUIZ_GET,result:result});
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.NOT_FOUND});
      
    }else{
            const result=await findQuizContent({status:status.ACTIVE,quizExpiration:{$gte:currentDate}});
            return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.QUIZ_GET,result:result});
        }
    } catch (error) {
        return next(error);
    }
};
exports.getDailyQuiz = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Set time to 00:00:00

        const result = await Quiz.aggregate([
            {
                $match: {
                    status: status.ACTIVE,
                    quizExpiration: { $gte: startOfDay }
                }
            },
            {
                $addFields: {
                    quizExpirationDate: { $dateToString: { format: "%Y-%m-%d", date: "$quizExpiration" } }
                }
            },
            {
                $match: {
                    quizExpirationDate: { $gt: moment(startOfDay).format("YYYY-MM-DD") }
                }
            }
        ]);


        if (result && result.length > 0) {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.OK,
                responseMessage: responseMessage.DATA_FOUND,
                result: result[0]
            });
        } else {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND
            });
        }
    } catch (error) {
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
           const isresponseExist=await findQuizResponseContent({questionId:isQuestionExist._id});
           if(isresponseExist){
            const isuserAlreadyRespond=await findQuizResponseContent({questionId:isQuestionExist._id,user:isUserExist._id});
            if(isuserAlreadyRespond){
                return res.status(statusCode.OK).send({
                    statusCode: statusCode.Conflict,
                    responseMessage: responseMessage.ALREADY_RESPOND,
                  });
            }
                const object={
                    user:isUserExist._id,
                    questionId:isQuestionExist._id,
                    question:isQuestionExist.question,
                    answer:answer,
                }
                const result=await createQuizResponseContent(object);
                return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.RESPONSE_SUBMIT,result:result});
            }
            
        const object={
            user:isUserExist._id,
            questionId:isQuestionExist._id,
            question:isQuestionExist.question,
            answer:answer,
            isFirstResponse:true,
            isWinner:true,
            resultDate:isQuestionExist.quizExpiration
        }
        const result=await createQuizResponseContent(object);
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.RESPONSE_SUBMIT,result:result});
    } catch (error) {
        return next(error);
    }
};

exports.getAllQuizQustion=async(req,res,next)=>{
    try {
        const result=await findQuizData({});
        if(result.length==0){
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND});
            }
            return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.RESPONSE_SUBMIT,result:result});
       
    } catch (error) {
        return next(error);
    }
}

exports.getWinnerOfQuiz=async(req,res,next)=>{
    try {
        const currentDate=new Date()
        let result={}
        result.lastDayWinner=await findQuizResponseContentPop({isWinner:true,isFirstResponse:true, resultDate: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }});
        if(result.lastDayWinner==null){
            result.lastDayWinner=await findWinnerlastday({isWinner:true,isFirstResponse:true,resultDate: {
                $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
            }});  
        }
        result.winnerList=await findQuizResponseData({isWinner:true,isFirstResponse:true,resultDate:{$lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())}});
       
        if(result.winnerList.length<1){
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND});

        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.WIINER_GOT,result:result});

    } catch (error) {
        return next(error);
    }
}

