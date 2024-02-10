const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const { pushNotification,mediapushNotification } = require('../../utilities/commonFunForPushNotification'); // Assuming you have a controller to send notifications
/***********SERVICES*********** */
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

exports.pushNotificationsToUser=async(req,res,next)=>{
    try {
        const {messageBody,messageTitle,notificationType}=req.body;
        // Fetch all users from the database
    const users = await eventBookingList({
        // 'contactNo.mobile_number': { $in: ['7222937463','8115199076', '9354416602'] },
        status: status.ACTIVE,
        deviceToken: { $exists: true, $ne: "" }
      });
      if(notificationType==="PEFA2024"){
        for (const user of users) {
            await pushNotification(user.deviceToken, messageBody,messageTitle);
          }
      }
      const usereTokenExist=await userList({status: status.ACTIVE,deviceToken: { $exists: true, $ne: ""}});
      for (const user of usereTokenExist) {
        await pushNotification(user.deviceToken, messageBody,messageTitle);
      }
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.SUCCESS})
    } catch (error) {
        console.log("error while push notification",error);
        return next(error)
    }
}