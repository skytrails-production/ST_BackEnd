const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const userType = require("../../enums/userType");


/**********************************SERVICES********************************** */
const {changeUserBookingServices}=require("../../services/btocServices/changeRequestServices");
const {createUserFlightChangeRequest,flightchangeRequestUserList1,createUserHotelChangeRequest,hotelchangeRequestUserList,createUserBusChangeRequest,buschangeRequestUserList}=changeUserBookingServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const { userflightBookingServices } = require('../../services/btocServices/flightBookingServices');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices
const {userBusBookingServices}=require("../../services/btocServices/busBookingServices")
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices
const { userhotelBookingModelServices } = require('../../services/btocServices/hotelBookingServices');
const { truncate } = require('fs/promises');
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking,aggregatePaginateHotelBookingList } = userhotelBookingModelServices


exports.createFlightTicketChangeRequest=async(req,res,next)=>{
    try {
        const  {reason,bookingId,flightBookingId,contactNumber,changerequest,amount,pnr}=req.body;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        console.log("currentDate:", currentDate);
        const isBookingExist=await findUserflightBooking({ userId: isUserExist._id,bookingId: bookingId,_id:flightBookingId,status:status.ACTIVE})
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }else if(isBookingExist.airlineDetails[0].Origin.DepTime<=currentDate){
            return res.status(statusCode.badRequest).send({statusCode:statusCode.badRequest,responseMessage:responseMessage.CHANGE_NOT_ALLOW})
        }
        const object={
            userId:isUserExist._id,
            reason: reason,
            flightBookingId: flightBookingId,
            bookingId: bookingId,
            pnr: pnr,
            contactNumber:contactNumber,
            changerequest:changerequest,
            amount:isBookingExist.amount
        }
        const result=await  createUserFlightChangeRequest(object);
        if(result){
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK,responseMessage:responseMessage.CHANGE_REQUEST_SUCCESS, result: result });
        }
    } catch (error) {
        console.log("error in creating flight change request",error);
        return next(error)
    }
}

exports.getUserFlightChangeRequest=async(req,res,next)=>{
    try {
        const {page, limit, search, fromDate, toDate}=req.query;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE,otpVerified:true });
        console.log("isAgentExists", isUserExist);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const result=flightchangeRequestUserList1(req.query);
        if(!result||result.length==0){
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error in gettiong change request list",error)
    }
}

// exports.createHotelTicketChangeRequest=async(req,res,next)=>{
//     try {
//         const {reason,bookingId,hotelBookingId,contactNumber,changerequest,amount}=req.body;
//         if (!isUserExist) {
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
//         }
//         const isBookingExist=await findUserhotelBookingModel({ userId: isUserExist._id,bookingId: bookingId,_id:hotelBookingId,status:status.ACTIVE})
//         if (!isBookingExist) {
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
//         }
//         const object={
//             userId:isUserExist._id,
//             reason: reason,
//             hotelBookingId: hotelBookingId,
//             bookingId: bookingId,
//             pnr: pnr,
//             contactNumber:contactNumber,
//             changerequest:changerequest,
//             amount:amount
//         }
//         const result=await  createUserHotelChangeRequest(object);
//         if(result){
//             return res.status(statusCode.OK).send({ statusCode: statusCode.OK,responseMessage:responseMessage.CHANGE_REQUEST_SUCCESS, result: result });
//         }
//     } catch (error) {
//         console.log("error in creating hotel change request",error);
//         return next(error)
//     }
// }

// exports.getUserHotelChangeRequest=async(req,res,next)=>{
//     try {
//         const {page,limit,search}=req.query;
//         console.log(" req.userId========", req.userId)
//         const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE });
//         console.log("isAgentExists", isUserExist);
//         if (!isUserExist) {
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
//         }
//         const result=await hotelchangeRequestUserList(req.query);
//         console.log("================",result);
//         if(!result||result.length==0){
//             return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
//         }
//         return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
//     } catch (error) {
//         console.log("error in gettiong change request list",error)
//     }
// }
