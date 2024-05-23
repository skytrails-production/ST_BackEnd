const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsApi = require("../../utilities/whatsApi");
const AdminNumber=process.env.ADMINNUMBER;
const bookingStatus=require("../../enums/bookingStatus")
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
const {userAmadeusFlightBookingServices}=require("../../services/amadeusServices/amadeusFlighBookingServices");
const {createUserAmadeusFlightBooking,findUserAmadeusFlightBooking,getUserAmadeusFlightBooking,findUserAmadeusFlightBookingData,deleteUserAmadeusFlightBooking,listUserAmadeusFlightBookings,updateUserAmadeusFlightBooking,paginateUserAmadeusFlightBookingSearch,countTotalUserAmadeusFlightBookings,aggregatePaginateGetUserAmadeusFlightBooking,aggregatePaginateGetUserAmadeusFlightBooking1}=userAmadeusFlightBookingServices;
//**********************************************************API's**********************************************/
exports.amdsFlightBooking=async(req,res,next)=>{
    try {
        // const {}=req.body;
        const data={...req.body};
        let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const isUserExist = await findUser({
            _id: req.userId,
            status: status.ACTIVE,
          });
          if (!isUserExist) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.USERS_NOT_FOUND,
            });
          };
          data.userId=isUserExist._id;
          data.bookingStatus = bookingStatus.BOOKED;
          // Format the date using the toLocaleDateString() function
          let formattedDate = new Date().toLocaleDateString('en-GB', options);
          const TemplateNames=[String("FLightBooking"),String(data.bookingId),String(isUserExist.username),String(formattedDate)];
          const result = await createUserAmadeusFlightBooking(data);
          await whatsApi.sendWhtsAppOTPAISensy(AdminNumber,TemplateNames,'admin_booking_Alert');
          return res.status(statusCode.OK).send({
            statusCode: statusCode.OK, 
            responseMessage: responseMessage.FLIGHT_BOOKED,
            result,
          });
    } catch (error) {
        console.log("error while trying to booking",error);
        return next(error)
    }
}

exports.getUserFlightBooking=async(req,res,next)=>{
    try {
        const { page, limit, search, fromDate, toDate } = req.query;
        const isUserExist = await findUser({
            _id: req.userId,
            status: status.ACTIVE,
          });
          if (!isUserExist) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.USERS_NOT_FOUND,
            });
          }
          const queryData={page, limit, search, fromDate, toDate,userId: isUserExist._id}
          const result=await aggregatePaginateGetUserAmadeusFlightBooking1(queryData);
          if (result.docs.length == 0) {
            return res.status(statusCode.OK).send({
              statusCode: statusCode.OK,
              responseMessage: responseMessage.DATA_NOT_FOUND,
            });
          }
          return res.status(statusCode.OK).send({
            statusCode: statusCode.OK, 
            responseMessage: responseMessage.FLIGHT_BOOKED,
            result,
          });
    } catch (error) {
        console.log("error while trying to get userFlight booking! ", error);
    return next(error);
    }
}