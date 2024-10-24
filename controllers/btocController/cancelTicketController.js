const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const { userflightBookingServices } = require('../../services/btocServices/flightBookingServices');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices
const bookingStatus = require('../../enums/bookingStatus');
const {userBusBookingServices}=require("../../services/btocServices/busBookingServices")
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices
const { userhotelBookingModelServices } = require('../../services/btocServices/hotelBookingServices');
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking,aggregatePaginateHotelBookingList } = userhotelBookingModelServices
const { cancelUserBookingServices } = require("../../services/btocServices/cancelBookingServices");
const {getBusData, createcancelFlightBookings, findCancelFlightBookings,updatecancelFlightBookings, aggregatePaginatecancelFlightBookingsList, countTotalcancelFlightBookings, createHotelCancelRequest, updateHotelCancelRequest, findCancelHotelBookings,getHotelCancelRequesrByAggregate1, countTotalHotelCancelled, createBusCancelRequest,findCancelBusBookings, updateBusCancelRequest, getBusCancelRequestByAggregate1, countTotalBusCancelled } = cancelUserBookingServices;
const {changeUserBookingServices}=require("../../services/btocServices/changeRequestServices");
const {createUserFlightChangeRequest,findamadeusChangeFlightRequest,flightchangeRequestUserList1,createUserHotelChangeRequest,hotelchangeRequestUserList,createUserBusChangeRequest,buschangeRequestUserList}=changeUserBookingServices;

const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;
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

//**********************************************************API********************************************** */
exports.cancelUserFlightBooking = async (req, res, next) => {
    try {
        const { reason, flightBookingId, bookingId, pnr } = req.body;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        if (!isUserExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        let  isBookingExist = await findUserflightBooking({
              userId: isUserExist._id,
              bookingId: Number(bookingId),
            });
          
          if(!isBookingExist||isBookingExist==null){
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
          }

        const isAlreadyRequested=await findCancelFlightBookings({userId:isUserExist._id,flightBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const isAlreadyChangeRequested=await findamadeusChangeFlightRequest({userId:isUserExist._id,flightBookingId:isBookingExist._id});
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
        const result = await createcancelFlightBookings(object);
        const notObject = {
            userId: isUserExist._id,
            title: "Cancel Ticket Request by User",
            description: `New cancel ticket request from the user on our platform. 🎊`,
            from: 'flightCancelRequest',
            to: isUserExist.userName,
          };
          
          await createPushNotification(notObject);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

// exports.getCancelUserFlightBooking = async (req, res, next) => {
//     try {
//         const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
//         if (!isUserExist) {
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
//         }
//         var userId=isUserExist._id;
//         const { page, limit, search, fromDate} = req.query;
//         const query={page, limit, search, fromDate, userId};
//         const result =await aggregatePaginatecancelFlightBookingsList(query);
//         if (!result) {
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
//         }
//         return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
//     } catch (error) {
//         return next(error);
//     }
// }

exports.getCancelUserFlightBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate, toDate,userId } = req.query;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE,otpVerified:true });
        if (!isUserExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result =await aggregatePaginatecancelFlightBookingsList(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.cancelUserHotelBooking = async (req, res, next) => {
    try {
        const { reason, hotelBookingId, bookingId } = req.body;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
    }
        const isBookingExist = await findUserhotelBookingModel({
            userId: isUserExist._id,
            bookingId: bookingId,
        });
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const isAlreadyRequested=await findCancelHotelBookings({userId:isUserExist._id,hotelBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const object = {
            userId: isUserExist._id,
            reason: reason,
            hotelBookingId: hotelBookingId,
            bookingId: bookingId,
        }
        const result = await createHotelCancelRequest(object);
        const notObject={
            userId:isUserExist._id,
            title:"Booking Cancelation Request by User",
            description:`New Cancel ticket request form user on our platform🎊.😒`,
            from:'HotelCancelRequest',
            to:isUserExist.userName,
          }
          await createPushNotification(notObject);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getCancelUserHotelBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate ,userId} = req.query;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result =await getHotelCancelRequesrByAggregate1(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.cancelUserBusBooking=async(req,res,next)=>{
    try {
        const { reason, busBookingId, busId, pnr } = req.body;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        const isBookingExist=await findUserBusBooking({
            userId: isUserExist._id,
            busId:busId,
        });
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const isAlreadyRequested=await findCancelBusBookings({userId:isUserExist._id,busBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const object={
            userId:isUserExist._id,
            reason: reason,
            busBookingId:busBookingId,
            busId:busId,
            pnr: pnr,
        }
        const result=await createBusCancelRequest(object);
        const notObject={
            userId:isUserExist._id,
            title:"Booking Cancelation Request by User",
            description:`New Cancel ticket request form user on our platform🎊.😒`,
            from:'BusCancelRequest',
            to:isUserExist.userName,
          }
          await createPushNotification(notObject);
        if(!result){
            return res.status(statusCode.OK).send({statusCode: statusCode.InternalError,responseMessage:responseMessage.INTERNAL_ERROR})
        } 
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getCancelUserBusBooking=async(req,res,next)=>{
    try {
        const { page, limit, search, fromDate, toDate,userId } =  req.query;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result=await getBusCancelRequestByAggregate1(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.updateProcesStatus=async(req,res,next)=>{
    try {
        const {procesStatus,requestId,type}=req.body;
        // Convert type to lowercase to handle case insensitivity
        const lowerCaseType =type.toLowerCase();   
        let result;
        if(lowerCaseType==='flight'){
            result= await updatecancelFlightBookings({_id:requestId},{$set:{processStatus:procesStatus}});
        }else if(lowerCaseType==='bus'){
            result= await updateBusCancelRequest({_id:requestId},{$set:{processStatus:procesStatus}});
        }else{
            result= await updateHotelCancelRequest({_id:requestId},{$set:{processStatus:procesStatus}});
        }
        if (result) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.OK,
              responseMessage: responseMessage.UPDATE_SUCCESS,
              result: result,
            });
          } else {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.badRequest,
              responseMessage: responseMessage.UPLOAD_FAILURE,
            });
          }
    } catch (error) {
        return next(error);
    }
}