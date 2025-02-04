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
  aggregatePaginateGetBooking1,
  aggrPagGetBookingAdmin
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
  aggrPagGetAmaBookingAdmin,
  aggPagGetUserBookingList
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
    aggrPagGetKafBookingAdmin,
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
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    const amadeusresult=await aggregatePaginateGetUserAmadeusFlightBooking1(queryData);
    if (amadeusresult.docs.length == 0) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
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

exports.getCombineFlightBookingResp= async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 1);
    limit = parseInt(limit, 10);

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

    // Fetch paginated booking data from all services
    const [tvoResponse, amadeusResponse, kafilaResponse] = await Promise.all([
      userflightBookingList({ userId: isUserExist._id, page, limit }),
      listUserAmadeusFlightBookings({ userId: isUserExist._id, page, limit }),
      getKafilaFlightBookings({ userId: isUserExist._id, page, limit })
    ]);

    // Handle cases where responses may be null
    let tvoArray = tvoResponse?.data || [];
    let amadeusArray = amadeusResponse?.data || [];
    let kafilaArray = kafilaResponse?.data || [];

    // Assuming the services return total items count
    const totalTvo = tvoResponse?.total || 0;
    const totalAmadeus = amadeusResponse?.total || 0;
    const totalKafila = kafilaResponse?.total || 0;

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: {
        user: isUserExist._id,
        tvo: {
          total: totalTvo,
          page,
          limit,
          data: tvoArray
        },
        amadeus: {
          total: totalAmadeus,
          page,
          limit,
          data: amadeusArray
        },
        kafila: {
          total: totalKafila,
          page,
          limit,
          data: kafilaArray
        }
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCombineFlightBookingRespAggregate = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    let result = {};
    
    // Check if the user exists
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
    
    // Prepare the query data for fetching bookings
    const queryData = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    
    // Fetch bookings from three sources concurrently
    const [tvoResponse, amadeusResponse, kafilaResponse] = await Promise.all([
      aggregatePaginateGetBooking1(queryData),
      aggPagGetUserBookingList(queryData),
      aggPagGetBookingList(queryData)
    ]);

    // Safely destructure or assign default values for each response
    const tvoArray = tvoResponse && Array.isArray(tvoResponse.docs) ? tvoResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    const amadeusArray = amadeusResponse && Array.isArray(amadeusResponse.docs) ? amadeusResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    const kafilaArray = kafilaResponse && Array.isArray(kafilaResponse.docs) ? kafilaResponse : { docs: [], totalDocs: 0, totalPages: 0 };

    // Combine docs and total counts
    result.docs = [...tvoArray.docs, ...amadeusArray.docs, ...kafilaArray.docs];
    result.totalDocs = tvoArray.totalDocs + amadeusArray.totalDocs + kafilaArray.totalDocs;
    result.totalAmadeusPages = amadeusArray.totalPages;
    result.totalTvoPages = tvoArray.totalPages;
    result.totalKafilaPages = kafilaArray.totalPages;

    // Send the combined result back
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: {
        user: isUserExist._id,
        result
      },
    });
  } catch (error) {
    // Handle errors gracefully
    return next(error);
  }
};

exports.getALLCombineFlightBookings = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    let result = {};
    const queryData = {
      page,
      limit,
      search,
      fromDate,
      toDate,
    };
    
    // Fetch bookings from three sources concurrently
    const [tvoResponse, amadeusResponse, kafilaResponse] = await Promise.all([
      aggrPagGetBookingAdmin(queryData),
      aggrPagGetAmaBookingAdmin(queryData),
      aggrPagGetKafBookingAdmin(queryData)
    ]);

    const tvoArray = tvoResponse && Array.isArray(tvoResponse.docs) ? tvoResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    const amadeusArray = amadeusResponse && Array.isArray(amadeusResponse.docs) ? amadeusResponse : { docs: [], totalDocs: 0, totalPages: 0 };
    const kafilaArray = kafilaResponse && Array.isArray(kafilaResponse.docs) ? kafilaResponse : { docs: [], totalDocs: 0, totalPages: 0 };

    result.docs = [...tvoArray.docs, ...amadeusArray.docs, ...kafilaArray.docs];
    result.totalDocs = tvoArray.totalDocs + amadeusArray.totalDocs + kafilaArray.totalDocs;
    result.totalAmadeusPages = amadeusArray.totalPages;
    result.totalTvoPages = tvoArray.totalPages;
    result.totalKafilaPages = kafilaArray.totalPages;

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: {
        user: isUserExist._id,
        result
      },
    });
  } catch (error) {
    // Handle errors gracefully
    return next(error);
  }
};