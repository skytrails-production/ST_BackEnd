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
exports.amdsFlightBooking = async (req, res, next) => {
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
    const result = await createUserAmadeusFlightBooking(data);
    const adminContact=['+918115199076','+919899564481','+919870249076']
    if(result.bookingStatus==bookingStatus.FAILED){
      const TemplateNames=['Amadeus Flight',String(data.pnr),String(isUserExist.username),String(formattedDate)];
      await whatsApi.sendWhtsAppAISensyMultiUSer(adminContact,TemplateNames,'adminBookingFailure');
      return res.status(statusCode.OK).send({
        statusCode: statusCode.ReqTimeOut, 
        responseMessage: responseMessage.BOOKING_FAILED,
      });

    }else{
      const TemplateNames=[String(data.from),String(data.pnr),String(isUserExist.username),String(formattedDate)];
      await whatsApi.sendWhtsAppAISensyMultiUSer(adminContact,TemplateNames,'admin_booking_Alert');
      return res.status(statusCode.OK).send({statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED,result });
    }
    
  } catch (error) {
    return next(error);
  }
};

exports.getUserFlightBooking = async (req, res, next) => {
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
    const queryData = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const result = await aggregatePaginateGetUserAmadeusFlightBooking1(
      queryData
    );
    if (result.docs.length == 0) {
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

exports.getFlightBookingId = async (req, res, next) => {
  try {
    const { flightBookingId } = req.query;
    const result = await getUserAmadeusFlightBooking({ _id: flightBookingId });
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

exports.getFlightBookingIdOfUser = async (req, res, next) => {
  try {
    const { flightBookingId } = req.query;
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
    const result = await getUserAmadeusFlightBooking({
      _id: flightBookingId,
      userId: isUserExist._id,
    });
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

exports.getAllUserFlightBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const queryData = { page, limit, search, fromDate, toDate };
    const result = await aggrPagGetUserAmadeusFlightBooking(queryData);
    if (result.docs.length == 0) {
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

exports.UpdateTicket1 = async (req, res, next) => {
  try {
    const { bookingId, ticketNumber, firstName } = req.body;
    const isBookignExist = await findUserAmadeusFlightBooking({
      _id: bookingId,
    });
    if (!isBookignExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const user=await findUser({_id:isBookignExist.userId});
    var depDate;
    var depTime;
    var arrTime;
    var templates;
    var finalResult=[];
    let options = { day: '2-digit', month: '2-digit', year: 'numeric' };

    // Update the ticket number for the specific passenger
    for(var passenger of firstName){
       result = await updateUserAmadeusFlightBooking(
        {
          _id: bookingId,
          "passengerDetails.firstName": passenger.firstName,
        },
        { $set: { "passengerDetails.$.TicketNumber": passenger.ticketNumber } }
      );
      finalResult.push(result);
       depDate=new Date(result.airlineDetails[0].Origin.DepTime);
       depTime=new Date(result.airlineDetails[0].Origin.DepTime);
      var arrTime=new Date(result.airlineDetails[0].Origin.DepTime);
      arrTime.setHours(arrTime.getHours() - 2);
       templates=[String(firstName),String(result.pnr),String(result.airlineDetails[0].Airline.AirlineName),String(depDate.toLocaleDateString('en-GB', options)),String(depTime.toLocaleTimeString('en-GB')),String(arrTime.toLocaleTimeString('en-GB')),String(result.totalAmount)];
       return result;
    }
    // const result = await updateUserAmadeusFlightBooking(
    //   {
    //     _id: bookingId,
    //     "passengerDetails.firstName": firstName,
    //   },
    //   { $set: { "passengerDetails.$.TicketNumber": ticketNumber } }
    // );
    await whatsApi.sendWhtsAppOTPAISensy('+91'+result[0].passengerDetails[0].ContactNo,templates,"flightBooking");
    const templateName=[String(user.username),String(result[0].pnr),String(result[0].airlineDetails[0].Airline.AirlineName),String(depDate.toLocaleDateString('en-GB', options)),String(depTime.toLocaleTimeString('en-GB')),String(arrTime.toLocaleTimeString('en-GB')),String(result[0].totalAmount)];
    await whatsApi.sendWhtsAppOTPAISensy('+91'+user.phone.mobile_number,templateName,"flightBooking");
    await sendSMSUtils.sendSMSForFlightBooking(result[0]);
    await commonFunction.FlightBookingConfirmationMail1(result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
    
  } catch (error) {
    return next(error);
  }
};

exports.UpdateTicket = async (req, res, next) => {
  try {
    const { bookingId, firstName } = req.body;
    const isBookingExist = await findUserAmadeusFlightBooking({ _id: bookingId });
    
    if (!isBookingExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const user = await findUser({ _id: isBookingExist.userId });
    let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    var finalResult ;
    let depDate, depTime, arrTime, templates;

    for (const passenger of firstName) {
      const result = await updateUserAmadeusFlightBooking(
        {
          _id: bookingId,
          "passengerDetails.firstName": passenger.firstName,
        },
        { $set: { "passengerDetails.$.TicketNumber": passenger.ticketNumber } }
      );
      if (result) {
        // finalResult.push(result);
        finalResult=result
        depDate = new Date(result.airlineDetails[0].Origin.DepTime);
        depTime = new Date(result.airlineDetails[0].Origin.DepTime);
        arrTime = new Date(result.airlineDetails[0].Origin.DepTime);
        arrTime.setHours(arrTime.getHours() - 2);

        templates = [
          String(passenger.firstName),
          String(result.pnr),
          String(result.airlineDetails[0].Airline.AirlineName),
          String(depDate.toLocaleDateString('en-GB', options)),
          String(depTime.toLocaleTimeString('en-GB')),
          String(arrTime.toLocaleTimeString('en-GB')),
          String(result.totalAmount)
        ];
      }
    }
    // Send WhatsApp messages and SMS
    // for (const result of finalResult) {
      const passengerContact = `+91${finalResult.passengerDetails[0].ContactNo}`;
      await whatsApi.sendWhtsAppOTPAISensy(passengerContact, templates, "flightBooking");
    // }

    const userTemplateName = [
      String(user.username),
      String(finalResult.pnr),
      String(finalResult.airlineDetails[0].Airline.AirlineName),
      String(depDate.toLocaleDateString('en-GB', options)),
      String(depTime.toLocaleTimeString('en-GB')),
      String(arrTime.toLocaleTimeString('en-GB')),
      String(finalResult.totalAmount)
    ];
    await whatsApi.sendWhtsAppOTPAISensy(`+91${user.phone.mobile_number}`, userTemplateName, "flightBooking");

    // Send SMS
    await sendSMSUtils.sendSMSForFlightBooking(finalResult[0]);

    // Send email confirmation
    await commonFunction.FlightBookingConfirmationMail1(finalResult);

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: finalResult,
    });
  } catch (error) {
    return next(error);
  }
};

exports.generatePdfOfUSer = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const data = await findUserAmadeusFlightBooking({ _id: bookingId });
    // sendSMS.
    const response = await commonFunction.FlightBookingConfirmationMail1(data);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.EMAIL_SENT,
      result: response,
    });
  } catch (error) {
    return next(error);
  }
};

