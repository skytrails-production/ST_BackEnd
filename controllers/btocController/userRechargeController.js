const status=require('../../enums/status')
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');

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
const { responseMessages } = require("../../common/const");
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
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
const {
  userBookingFailedServices,
} = require("../../services/btocServices/userBookingFailedServices");
const { stat } = require("fs");
const {
  createUserBookingFailed,
  findUserBookingFailed,
  getUserBookingFailed,
  deleteUserBookingFailed,
  countTotalUserBookingFailed,
} = userBookingFailedServices;
const {userRechargeServices}=require("../../services/btocServices/userRechargeServices");
const {createUserRechargeApplication,findUserRechargeApplication,deleteUserRechargeApplication,userRechargeApplicationList,updateUserRechargeApplication,countTotalUserRechargeApplication,userRechargeApplicationfind}=userRechargeServices;

//**********************************************API's************************************************/

exports.createRechargeHistory=async (req,res,next)=>{
    try {
        const {amount,mobileOperator,mobileNumber,paymentId,easeBuzzPayId,bookingType,userId}=req.body;
        const isUserExist = await findUser({
            _id: req.userId,
            status: status.ACTIVE,
          });
          if (!isUserExist) {
            return res.status(statusCode.NotFound).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.USERS_NOT_FOUND,
            });}
    req.body.userId=isUserExist._id;
    // const obj={
    //     amount,mobileOperator,mobileNumber,paymentId,easeBuzzPayId,bookingType
    // }
const result=await createUserRechargeApplication(req.body);
if(result){
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.CREATED_SUCCESS,
        result:result
      });
}
    } catch (error) {
        console.log("error whiel create recharge history",error);
    }
}

exports.getReachargeHistory=async(req,res,next)=>{
    try {
      const isUserExist = await findUserData({
        _id: req.userId,
        status: status.ACTIVE,
      });
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
      }
      const result=await userRechargeApplicationfind({userId:isUserExist._id});
      if (result.length === 0 || !result) {
        return res.status(statusCode.NotFound).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
      }
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_FOUND,
        result:result
      });
    } catch (error) {
      console.log("error while trying to get history of user recharge====",error);
      return next(error)
    }
  }