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
const {getBusData, createcancelFlightBookings, findAnd,updatecancelFlightBookings, aggregatePaginatecancelFlightBookingsList, countTotalcancelFlightBookings, createHotelCancelRequest, updateHotelCancelRequest, getHotelCancelRequesrByAggregate1, countTotalHotelCancelled, createBusCancelRequest, updateBusCancelRequest, getBusCancelRequestByAggregate1, countTotalBusCancelled } = cancelUserBookingServices;
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;


//**********************************************************API********************************************** */
exports.cancelUserFlightBooking = async (req, res, next) => {
    try {
        const { reason, flightBookingId, bookingId, pnr } = req.body;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const isBookingExist = await findUserflightBooking({
            userId: isUserExist._id,
            bookingId: bookingId,
            
        });
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
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
        const notObject={
            userId:isUserExist._id,
            title:"Cacel ticket Request by User",
            description:`New Cancel ticket request form user on our platform🎊.😒`,
            from:'flightCancelRequest',
            to:isUserExist.userName,
          }
          await createPushNotification(notObject);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        console.log("error in cancelFlightBooking:", error);
        return next(error);
    }
}

// exports.getCancelUserFlightBooking = async (req, res, next) => {
//     try {
//         const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
//         console.log("isUserExist", isUserExist);
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
//         console.log("error to get cancel flight", error);
//         return next(error);
//     }
// }

exports.getCancelUserFlightBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate, toDate,userId } = req.query;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE,otpVerified:true });
        // console.log("isAgentExists", isUserExist);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result =await aggregatePaginatecancelFlightBookingsList(req.query);
        // console.log("result========",result);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error to get cancel flight", error);
        return next(error);
    }
}

exports.cancelUserHotelBooking = async (req, res, next) => {
    try {
        const { reason, hotelBookingId, bookingId } = req.body;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
    }
        const isBookingExist = await findUserhotelBookingModel({
            userId: isUserExist._id,
            bookingId: bookingId,
        });
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
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
        console.log("error in cancelFlightBooking:", error);
        return next(error);
    }
}

exports.getCancelUserHotelBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate ,userId} = req.query;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result =await getHotelCancelRequesrByAggregate1(req.query);
        // console.log("result========",result);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error to get cancel flight", error);
        return next(error);
    }
}

exports.cancelUserBusBooking=async(req,res,next)=>{
    try {
        const { reason, busBookingId, busId, pnr } = req.body;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        const isBookingExist=await findUserBusBooking({
            userId: isUserExist._id,
            busId:busId,
        });
        if (!isBookingExist) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
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
            return res.status(statusCode.InternalError).send({statusCode: statusCode.InternalError,responseMessage:responseMessage.INTERNAL_ERROR})
        } 
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        console.log("error",error);
        return next(error);
    }
}

exports.getCancelUserBusBooking=async(req,res,next)=>{
    try {
        const { page, limit, search, fromDate, toDate,userId } =  req.query;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
        if (!isUserExist) {
          return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
        }
        req.query.userId=isUserExist._id;
        const result=await getBusCancelRequestByAggregate1(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error",error);
        return next(error);
    }
}