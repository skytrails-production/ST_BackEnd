const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const userType = require("../../enums/userType");
const sendSMSUtils = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsApi = require("../../utilities/whatsApi");
const AdminNumber = process.env.ADMINNUMBER;
const bookingStatus = require("../../enums/bookingStatus");
/**********************************SERVICES********************************** */
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;

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
const {KafilaCancellationServices}=require("../../services/kafilaServices/cancelBooking");
const {createKafilaCancelFlightBookings,findKafilaCancelFlightBookings,updateKafilacancelFlightBookings,aggrPagcancelFlightBookingsList,aggPagKafilaCancelFlightBookingsList1,countTotalKafilaCancelFlightBookings}=KafilaCancellationServices;
const {changeKafilaUserBookingServices}=require('../../services/kafilaServices/changeRequest');
const {createKafilaUserFlightChangeRequest,flightKafilachangeRequestUserList,flightKafilaChangeRequestUserList1,kafilaFindOneChangeRequestDetail,countKafilaChangeFlightRequest}=changeKafilaUserBookingServices;
const {userKafilaFlightBookingServices}=require("../../services/kafilaServices/flightBookingServices");
const {createKafilaFlightBooking,findKafilaFlightBooking,getKafilaFlightBookings,deleteKafilaFlightBooking,updateKafilaFlightBooking,paginateKafilaFlightBookingSearch,countTotalKafilaFlightBookings,aggPagGetBookingList,aggrPagGetKafBookingAdmin}=userKafilaFlightBookingServices;
//**********************************************************API's**********************************************/
exports.cancelUserFlightTicket = async (req, res, next) => {
  try {
      const { reason, flightBookingId, bookingId, pnr } = req.body;
      const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
      if (!isUserExist) {
          return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
      }
     
      let isBookingExist = await findKafilaFlightBooking({userId: isUserExist._id,bookingId: bookingId});
        
        if(!isBookingExist||isBookingExist==null){
          return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }

      const isAlreadyRequested=await findKafilaCancelFlightBookings({userId:isUserExist._id,flightBookingId:isBookingExist._id});
      if(isAlreadyRequested){
          return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
      }
      const isAlreadyChangeRequested=await kafilaFindOneChangeRequestDetail({userId:isUserExist._id,flightBookingId:isBookingExist._id})
      if(isAlreadyChangeRequested){
        return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_CHANGE_REQUESTED});
    }
      const object = {
          userId: isUserExist._id,
          reason: reason,
          flightBookingId: flightBookingId,
          bookingId: bookingId,
          pnr: pnr,
          amount:isBookingExist.totalAmount
      }
      const result = await createKafilaCancelFlightBookings(object);
      const TemplateNames = [
        String("kafila FLightTicket Cancel"),
        String("hello"),
        String(isUserExist.username),
        String("formattedDate"),
      ];
      const adminContact=[process.env.ADMINNUMBER1,process.env.ADMINNUMBER2,process.env.ADMINNUMBER];
      await whatsApi.sendWhtsAppAISensyMultiUSer(
        adminContact,
        TemplateNames,
        "admin_booking_Alert"
      );
      const notObject = {
          userId: isUserExist._id,
          title: "Cancel Ticket Request by User",
          description: `New kafila  ticket cancel request from the user on our platform. 🎊`,
          from: 'flightCancelRequest',
          to: isUserExist.userName,
        };
        
        await createPushNotification(notObject);
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
  } catch (error) {
      return next(error);
  }
}

exports.getUserCancelFlights = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE,otpVerified:true });
    if (!isUserExist) {
        return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    req.query.userId=isUserExist._id;
    const result =await aggrPagcancelFlightBookingsList(req.query);
    if (!result) {
        return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
} catch (error) {
    return next(error);
  }
};

exports.getCancelFlightBookingId = async (req, res, next) => {
  try {
    const {cancelRequestId}=req.query;
    const result=await findKafilaCancelFlightBookings({_id:cancelRequestId});
    if (!result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
  }
  return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.getCancelFlightIdOfUser = async (req, res, next) => {
  try {
   
  } catch (error) {
    return next(error);
  }
};

exports.getAllUserCancelFlight = async (req, res, next) => {
  try {
    const {page, limit, search, fromDate, toDate}=req.query;
  const result=await aggPagKafilaCancelFlightBookingsList1(req.query);
  if (result.docs.length == 0) {
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_NOT_FOUND,
    });
  }
  return res
    .status(statusCode.OK)
    .send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};




