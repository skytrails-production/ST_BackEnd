const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const adminModel=require('../../model/user.model')
const { pushNotification,mediapushNotification } = require('../../utilities/commonFunForPushNotification'); // Assuming you have a controller to send notifications
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  userList,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");
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

const {eventBookingServices,} = require("../../services/btocServices/eventBookingServices");
const {
  createBookingEvent,
  findBookingEventData,
  deleteBookingEvent,
  eventBookingList,
  updateBookingEvent,
  countTotalBookingEvent,
  eventBookingListPopulated,
  getBookingEvent,
} = eventBookingServices;
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const _ = require("mongoose-paginate-v2");
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;


//*******************************API************************************************** */
exports.pushNotificationsToUser=async(req,res,next)=>{
    try {
        const {messageBody,messageTitle,notificationType,imageUrl1}=req.body;
        // Fetch all users from the database
    const users = await eventBookingList({
        // 'contactNo.mobile_number': { $in: ['7222937463','8115199076', '9354416602'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" }
      });
      // const image="https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg"||imageUrl;
      const imageUrl=`https://raw.githubusercontent.com/The-SkyTrails/Images/main/notification2.jpg `
      if(notificationType==="PEFA2024"){
        for (const user of users) {
          try {
            await pushNotification(user.deviceToken, messageTitle, messageBody,imageUrl);
            console.log('Notification cron job executed successfully');
          } catch (pushError) {
            // Handle if any user is not registered
            console.error('Error while sending push notification to user:', pushError);
            // continue to the next user even if one fails
            continue;
          }
          }
          return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.SUCCESS});
      }
      // 'phone.mobile_number':'8115199076'
      const usereTokenExist=await userList({status: status.ACTIVE,deviceToken: { $exists: true, $ne: ""}});
      for (const user of usereTokenExist) {
        try {
          await pushNotification(user.deviceToken, messageTitle, messageBody,imageUrl);
          console.log('Notification cron job executed successfully');
        } catch (pushError) {
          // Handle if any user is not registered
          console.error('Error while sending push notification to user:', pushError);
          // continue to the next user even if one fails
          continue;
        }
      }
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.SUCCESS});
    } catch (error) {
        console.log("error while push notification",error);
        return next(error)
    }
}


exports.getAllNotificationOfAmdin=async(req,res,next)=>{
  try {
    const {adminId}=req.params;
    const isAdminExist=await adminModel.findOne({_id:adminId,userType:userType.ADMIN});
    if(!isAdminExist){
      return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.ADMIN_NOT_FOUND})
    }
    const result=await findPushNotificationData({isRead:'false',from:'holidayEnquiry'});
    if(result.length==null||!result){
      return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.NOTIFICATION_NOT_AVAILABLE,message:"Stay in touch!You will find all the new updates here"});
    }
    return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
  } catch (error) {
    console.log("error while trying to get all notification",error);
    return next(error)
  }
}

exports.getNotificationById=async(req,res,next)=>{
  try {
    const {id}=req.params;
    const isNotificationExist=await findPushNotification({_id:id});
    if(!isNotificationExist){
      return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.NOTIFICATION_INCORRECT});
    }
    await updatePushNotification({_id:isNotificationExist._id},{isRead:true});
    const result=await findPushNotificationData({isRead:'false',from:'holidayEnquiry'});
    return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.NOTIFICATION_READ,result:result});
  } catch (error) {
    console.log("error while get notification by Id",error);
    return next(error)
  }
}