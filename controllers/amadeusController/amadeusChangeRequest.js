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
const {
  userflightBookingServices,
} = require("../../services/btocServices/flightBookingServices");
const { aggregatePaginate } = require("../../model/role.model");
const {
  createUserflightBooking,
  findUserflightBooking,
  getUserflightBooking,
  findUserflightBookingData,
  deleteUserflightBooking,
  userflightBookingList,
  updateUserflightBooking,
  paginateUserflightBookingSearch,
  aggregatePaginateGetBooking,
} = userflightBookingServices;
const {
  userAmadeusFlightBookingServices,
} = require("../../services/amadeusServices/amadeusFlighBookingServices");
const {
  createUserAmadeusFlightBooking,
  findUserAmadeusFlightBooking,
  getUserAmadeusFlightBooking,
  findUserAmadeusFlightBookingData,
  deleteUserAmadeusFlightBooking,
  listUserAmadeusFlightBookings,
  updateUserAmadeusFlightBooking,
  paginateUserAmadeusFlightBookingSearch,
  countTotalUserAmadeusFlightBookings,
  aggregatePaginateGetUserAmadeusFlightBooking,
  aggregatePaginateGetUserAmadeusFlightBooking1,
  aggrPagGetUserAmadeusFlightBooking,
} = userAmadeusFlightBookingServices;
const {changeAmadeusUserBookingServices}=require('../../services/amadeusServices/amadeysFlightChangeRequestServices');
const {createAmdeusUserFlightChangeRequest,flightAmdeuschangeRequestUserList,amdeusFindOneChangeRequestDetail,countAmdeusChangeFlightRequest}=changeAmadeusUserBookingServices;
const {amadeusCncellationServices}=require("../../services/amadeusServices/amadeusFlightCancelRequest");
const {createamadeusCancelFlightBookings,findamadeusCancelFlightBookings,aggregatePaginatecancelFlightBookingsList,aggPagamadeusCancelFlightBookingsList1,countTotalamadeusCancelFlightBookings}=amadeusCncellationServices;


//**********************************************************API's**********************************************/
exports.amdsChangeFlight = async (req, res, next) => {
  try {
    const  {reason,bookingId,flightBookingId,contactNumber,changerequest,pnr}=req.body;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        if (!isUserExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        const isBookingExist=await getUserAmadeusFlightBooking({ userId: isUserExist._id,bookingId: bookingId,_id:flightBookingId,status:status.ACTIVE});
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }else if(isBookingExist.airlineDetails[0].Origin.DepTime<=currentDate){
            return res.status(statusCode.OK).send({statusCode:statusCode.badRequest,responseMessage:responseMessage.CHANGE_NOT_ALLOW})
        }
        const isAlreadyRequested=await amdeusFindOneChangeRequestDetail({userId:isUserExist._id,flightBookingId:isBookingExist._id})
        if(isAlreadyRequested){
          return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_CHANGE_REQUESTED});
      }
      const isCancelRequestAlreadyExist=await findamadeusCancelFlightBookings({userId:isUserExist._id,flightBookingId:isBookingExist._id});
      if(isCancelRequestAlreadyExist){
        return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
      }
        const object={
            userId:isUserExist._id,
            reason: reason,
            flightBookingId: flightBookingId,
            bookingId: bookingId,
            pnr: pnr,
            contactNumber:contactNumber,
            changerequest:changerequest,
            amount:isBookingExist.totalAmount
        }
        const result=await  createAmdeusUserFlightChangeRequest(object);
        const notObject={
            userId:isUserExist._id,
            title:"Booking Change Request by User",
            description:`New Change ticket request form user on our platform🎊.😒`,
            from:'FlightChangeRequest',
            to:isUserExist.userName,
          }
          await createPushNotification(notObject);
          const TemplateNames = [
            String("FLightTicket Change"),
            String("change details"),
            String(isUserExist.username),
            String("formattedDate"),
          ];
          const adminContact=[process.env.ADMINNUMBER1,process.env.ADMINNUMBER2,process.env.ADMINNUMBER,process.env.ADMINNUMBER3,process.env.ADMINNUMBER4];
          await whatsApi.sendWhtsAppAISensyMultiUSer(
            adminContact,
            TemplateNames,
            "admin_booking_Alert"
          );
        if(result){
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK,responseMessage:responseMessage.CHANGE_REQUEST_SUCCESS, result: result });
        }
  } catch (error) {
    return next(error);
  }
};

exports.getUserChangeFlights = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
      otpVerified: true,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
    }
    req.query.userId = isUserExist._id;
    const result = await flightAmdeuschangeRequestUserList(req.query);
    if (!result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    return next(error);
  }
};

exports.getChangeFlightBookingId = async (req, res, next) => {
  try {
    const {changeReqId}=req.query;
    
  } catch (error) {
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};

exports.getChangeFlightIdOfUser = async (req, res, next) => {
  try {
   
  } catch (error) {
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};

exports.getAllUserChangeFlight = async (req, res, next) => {
  try {
  
  } catch (error) {
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};


