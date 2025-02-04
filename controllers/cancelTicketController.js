const responseMessage = require('../utilities/responses');
const statusCode = require('../utilities/responceCode')
const status = require("../enums/status");
const userType = require("../enums/userType");
const moment = require("moment");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../common/common");
const commonFunction = require('../utilities/commonFunctions');
const sendSMS = require('../utilities/sendSms');
const bookingStatus = require('../enums/bookingStatus');
/**********************************SERVICES********************************** */
const { cancelBookingServices } = require("../services/cancelServices");
const { createcancelFlightBookings, findCancelFlightBookings,updatecancelFlightBookings, aggregatePaginatecancelFlightBookingsList, countTotalcancelFlightBookings,findCancelHotelBookings, createHotelCancelRequest, updateHotelCancelRequest, getHotelCancelRequesrByAggregate, countTotalHotelCancelled, createBusCancelRequest, updateBusCancelRequest, findCancelBusBookings,getBusCancelRequestByAggregate, countTotalBusCancelled,getBusCancellation } = cancelBookingServices;
const { brbuserServices } = require('../services/btobagentServices');
const { createbrbuser, findbrbuser, getbrbuser, findbrbuserData, updatebrbuser, deletebrbuser, brbuserList, paginatebrbuserSearch, countTotalbrbUser } = brbuserServices;
const { userServices } = require('../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList, aggregatePaginateHotelBookingList1, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking } = hotelBookingServicess;
// const { userBusBookingServices } = require('../services/');
// const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices
const { userflightBookingServices } = require('../services/btocServices/flightBookingServices');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices
const {changeFlightServices}=require("../services/changeRequest")
//----------------------------------------------MODELS-----------------------------------------     
const flightModel = require('../model/flightBookingData.model')
const hotelBookingModel = require('../model/hotelBooking.model')
const busBookingModel = require("../model/busBookingData.model");




//*******************************CANCELATION API'S ****************************/

exports.cancelFlightBooking = async (req, res, next) => {
    try {
        const { reason, flightBookingId, bookingId, pnr, agentId } = req.body;
        const isAgentExists = await findbrbuser({ _id: agentId });
        if (!isAgentExists) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        const isBookingExist = await flightModel.findOne({
            userId: isAgentExists._id,
            bookingId: bookingId,
            dateOfJourney: { $gt: currentDate }
        });
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const isAlreadyRequested=await findCancelFlightBookings({userId:isAgentExists._id,flightBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const object = {
            userId: isAgentExists._id,
            reason: reason,
            flightBookingId: flightBookingId,
            bookingId: bookingId,
            pnr: pnr,
        }
        const result = await createcancelFlightBookings(object);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getCancelFlightBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate } = req.query;
        const result =await aggregatePaginatecancelFlightBookingsList(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.cancelHotelBooking = async (req, res, next) => {
    try {
        const { reason, hotelBookingId, bookingId, pnr, agentId } = req.body;
        const isAgentExists = await findbrbuser({ _id: agentId });
        if (!isAgentExists) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        const isBookingExist = await findhotelBooking({
            userId: isAgentExists._id,
            bookingId: bookingId,
            CheckInDate: { $gt: currentDate }
        });
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const isAlreadyRequested=await findCancelHotelBookings({userId:isAgentExists._id,hotelBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const object = {
            userId: isAgentExists._id,
            reason: reason,
            hotelBookingId: hotelBookingId,
            bookingId: bookingId,
            pnr: pnr,
        }
        const result = await createHotelCancelRequest(object);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getCancelHotelBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate } = req.query;
        const result =await getHotelCancelRequesrByAggregate(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.cancelBusBooking=async(req,res,next)=>{
    try {
        const { reason, busBookingId, busId, pnr, agentId } = req.body;
        const isAgentExists = await findbrbuser({ _id: agentId });
        if (!isAgentExists) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        const currentDate = new Date().toISOString().split('T')[0];        
        const isBookingExist=await busBookingModel.findOne({
            userId: isAgentExists._id,
            busId:busId,
            dateOfJourney:{$gt:currentDate},
        });
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const isAlreadyRequested=await findCancelBusBookings({userId:isAgentExists._id,busBookingId:isBookingExist._id});
        if(isAlreadyRequested){
            return res.status(statusCode.OK).send({ statusCode: statusCode.Conflict, responseMessage: responseMessage.ALREADY_REQUESTED});
        }
        const object={
            userId:isAgentExists._id,
            reason: reason,
            busBookingId:busBookingId,
            busId:busId,
            pnr: pnr,
        }
        const result=await createBusCancelRequest(object);
        if(!result){
            return res.status(statusCode.InternalError).send({statusCode: statusCode.InternalError,responseMessage:responseMessage.INTERNAL_ERROR})
        } 
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        return next(error);
    }
}

exports.getCancelBusBooking=async(req,res,next)=>{
    try {
        const { page, limit, search, fromDate,toDate } = req.query;
        const result=await getBusCancellation(req.query);
        if (!result) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        return next(error);
    }
}