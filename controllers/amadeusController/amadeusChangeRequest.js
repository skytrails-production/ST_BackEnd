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
//**********************************************************API's**********************************************/
exports.amdsChangeFlight = async (req, res, next) => {
  try {
    
  } catch (error) {
    console.log("error while trying to booking", error);
    return next(error);
  }
};

exports.getUserChangeFlights = async (req, res, next) => {
  try {
  
  } catch (error) {
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};

exports.getChangeFlightBookingId = async (req, res, next) => {
  try {
    
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


