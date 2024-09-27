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

//**********************************************************API's**********************************************/
exports.userFlightBooking = async (req, res, next) => {
  try {
    const data = { ...req.body };
    let options = { day: "2-digit", month: "2-digit", year: "numeric" };
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
    data.userId = isUserExist._id;
    let formattedDate = new Date().toLocaleDateString("en-GB", options);
    const result = await createKafilaFlightBooking(data);
    const adminContact=['+918115199076','+919899564481','+919870249076']
    if(result.bookingStatus==bookingStatus.FAILED){
        const TemplateNames=['Kafila Flight',String(data.pnr),String(isUserExist.username),String(formattedDate)];
        await whatsApi.sendWhtsAppAISensyMultiUSer(adminContact,TemplateNames,'adminBookingFailure');
        return res.status(statusCode.OK).send({
          statusCode: statusCode.ReqTimeOut, 
          responseMessage: responseMessage.BOOKING_FAILED,
        });
  
      }else{
        const TemplateNames=['Kafila Flight',String(data.pnr),String(isUserExist.username),String(formattedDate)];
        await whatsApi.sendWhtsAppAISensyMultiUSer(adminContact,TemplateNames,'admin_booking_Alert');
        const userName = `${data?.passengerDetails[0]?.firstName} ${data?.passengerDetails[0]?.lastName}`;
      const phone = '+91'+data?.passengerDetails[0]?.ContactNo;
      const url=`https://theskytrails.com/FlightEticket/${result._id}`;
      // await whatsApi.sendMessageWhatsApp(phone,userName,url,'flight');
      const depDate=new Date(data.airlineDetails[0].Origin.DepTime);
      const depTime=new Date(data.airlineDetails[0].Origin.DepTime);
      const arrTime=new Date(data.airlineDetails[0].Destination.ArrTime);
      const templates=[String(userName),String(data.pnr),String(data.airlineDetails[0].Airline.AirlineName),String(depDate.toLocaleDateString('en-GB', options)),String(depTime.toLocaleTimeString('en-GB')),String(arrTime.toLocaleTimeString('en-GB')),String(data.totalAmount)];
      await whatsApi.sendWhtsAppOTPAISensy(phone,templates,"flightBooking");
      await sendSMSUtils.sendSMSForFlightBooking(data);
      await commonFunction.FlightBookingConfirmationMail(result);
      return res.status(statusCode.OK).send({statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED,result });
      }
  } catch (error) {
    return next(error);
  }
};

exports.getUserFlightBooking=async(req,res,next)=>{
  try{
   const { page, limit, search, fromDate, toDate } = req.query;
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
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const result = await aggrPagGetKafilaFlightBooking(body);
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  }catch{
    return next(error);
  }
  };

exports.getUserFlightData = async (req, res, next) => {
  try {
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
    const result = await getKafilaFlightBookings({ status: status.ACTIVE,userId:isUserExist._id });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.getUserFlightBookings=async(req,res,next)=>{
  try{
   const { page, limit, search, fromDate, toDate } = req.query;
   
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
    };
    const result = await aggrPagGetKafilaFlightBooking(body);
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  }catch{
    return next(error);
  }
  };

exports.getFlightBookingId = async (req, res, next) => {
  try {
    const { flightBookingId } = req.query;
    const result = await findKafilaFlightBooking({ _id: flightBookingId });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.FLIGHT_BOOKED,
      result,
    });
  } catch (error) {
    return next(error);
  }
};