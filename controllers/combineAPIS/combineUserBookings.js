const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const axios = require("axios");
const nodeCrypto = require("crypto");
const xml2js = require("xml2js");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
function generateRandomBytes(length) {
  return crypto.randomBytes(length);
}
const commonUrl = require("../../common/const");
const moment = require('moment');
const tvoFlightBooking = require("../../routes/btocRoutes/btocRoutes");
const amadeusFlightBooking = require("../../routes/amadeusRoutes/amadeusFlightBookingRoutes");
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
  userflightBookingServices,
} = require("../../services/btocServices/flightBookingServices");
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
  aggregatePaginateGetBooking1
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
const {
  userGrnBookingModelServices,
} = require("../../services/btocServices/grnBookingServices");
const {
  createUserGrnBooking,
  findUserGrnBooking,
  findUserGrnBookingList,
  getUserGrnBooking,
  deleteUserGrnBooking,
  userGrnBooking,
  updateGrnBooking,
  paginateUserGrnBooking,
  countTotalUserGrnBooking,
  aggrPagiGrnBookingList,
} = userGrnBookingModelServices;

const {
  userhotelBookingModelServices,
} = require("../../services/btocServices/hotelBookingServices");
const {
  createUserhotelBookingModel,
  findUserhotelBookingModel,
  getUserhotelBookingModel,
  deleteUserhotelBookingModel,
  userhotelBookingModelList,
  updateUserhotelBookingModel,
  paginateUserhotelBookingModelSearch,
  findUserhotelBookingModelData,
  countTotalhotelBooking,
  aggregatePaginateHotelBookingList,
} = userhotelBookingModelServices;
const {
  userKafilaFlightBookingServices,
} = require("../../services/kafilaServices/flightBookingServices");
const {
    createKafilaFlightBooking,
    findKafilaFlightBooking,
    getKafilaFlightBookings,
    deleteKafilaFlightBooking,
    updateKafilaFlightBooking,
    paginateKafilaFlightBookingSearch,
    countTotalKafilaFlightBookings,
    aggregatePaginateGetKafilaFlightBooking1,
    aggrPagGetKafilaFlightBooking,
    aggPagGetBookingList,
} = userKafilaFlightBookingServices;
//*****************************API"S******************************************************/
exports.getAmadeusTvo = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    let result={}
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const queryData = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const tvoBookingresult = await aggregatePaginateGetBooking(queryData);
    result.totalDocs=tvoBookingresult.totalDocs;
    result.totalTvoPages=tvoBookingresult.totalPages;
    if (tvoBookingresult.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    const amadeusresult=await aggregatePaginateGetUserAmadeusFlightBooking1(queryData);
    if (amadeusresult.docs.length == 0) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          message: responseMessage.DATA_NOT_FOUND,
        });
      }
      
    result.docs = [...tvoBookingresult.docs, ...amadeusresult.docs];
    result.totalDocs += amadeusresult.totalDocs;
    result.totalAmadeusPages = amadeusresult.totalPages;
   
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result,
      });
  } catch (error) {
    return next(error);
  }
};

exports.getCombineHotelBookingList=async(req,res,next)=>{
  try {
    let result=[]
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const tboHotelBookings=await findUserhotelBookingModelData({ userId: isUserExist._id});
    const grnHotelBookings=await userGrnBooking({ userId: isUserExist._id});
    result= tboHotelBookings.concat(grnHotelBookings)
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result,
    });
  } catch (error) {
    return next(error);
    
  }
}

exports.getCombineFlightBookingResp=async(req,res,next)=>{
  try {
    let result=[];
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
   
    const [tvoResponse, amadeusResponse,kafilaResponse] = await Promise.all([
      userflightBookingList({userId: isUserExist._id}),
      listUserAmadeusFlightBookings({userId: isUserExist._id}),
      getKafilaFlightBookings({userId: isUserExist._id})
    ]);
    let tvoArray = tvoResponse!==null
    ? tvoResponse
    : [];
    let amadeusArray = amadeusResponse!==null
    ? amadeusResponse
    : [];
    let kafilaArray = kafilaResponse!==null
    ? kafilaResponse
    : [];
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: {
        user:isUserExist._id,
        tvoArray,
        amadeusArray,
        kafilaArray
      },
    });
  } catch (error) {
    return next(error)
    
  }
}

exports.getCombineFlightBookingRespAggregate=async(req,res,next)=>{
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    let result={};
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const queryData = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const [tvoResponse, amadeusResponse,kafilaResponse] = await Promise.all([
      aggregatePaginateGetBooking1(queryData),
      aggregatePaginateGetUserAmadeusFlightBooking1(queryData),
      aggregatePaginateGetKafilaFlightBooking1(queryData)
    ]);
    let tvoArray = Array.isArray(tvoResponse.docs) && tvoResponse.docs.length > 0 ? tvoResponse : [];
    let amadeusArray = Array.isArray(amadeusResponse.docs) && amadeusResponse.docs.length > 0 ? amadeusResponse : [];
    let kafilaArray = Array.isArray(kafilaResponse.docs) && kafilaResponse.docs.length > 0 ? kafilaResponse : [];
    result.docs = [...tvoArray.docs, ...amadeusArray.docs,...kafilaArray.docs];
    result.totalDocs = amadeusArray.totalDocs+kafilaArray.totalDocs;
    result.totalAmadeusPages = amadeusArray.totalPages;
    result.totalTvoPages=tvoArray.totalPages;
    result.totalKafilaPages=kafilaArray.totalPages;

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: {
        user:isUserExist._id,
        result
      },
    });
  } catch (error) {
    return next(error)
    
  }
}