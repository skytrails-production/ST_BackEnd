const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const whatsApi = require("../../utilities/whatsApi");
const bookingStatus = require("../../enums/bookingStatus");
const AdminNumber=process.env.ADMINNUMBER;
/**********************************SERVICES********************************** */
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;
const {
  pushNotificationAfterDepricate,
} = require("../../utilities/commonFunForPushNotification");
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const sendSMSUtils = require("../../utilities/sendSms");
const {
  userflightBookingServices,
} = require("../../services/btocServices/flightBookingServices");
const { aggregatePaginate, findById } = require("../../model/role.model");
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

exports.flighBooking = async (req, res, next) => {
  try {
    const data = { ...req.body };
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
    
    data.userId = isUserExist._id;
    // data.bookingStatus = bookingStatus.BOOKED;
    const notObject={
      userId:isUserExist._id,
      title:"Flight Booking by User",
      description:`New Flight ticket booking by user on our platform🎊.🙂`,
      from:'FLightBooking',
      to:isUserExist.username,
    }
    await createPushNotification(notObject);
    
    let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
// Format the date using the toLocaleDateString() function
let formattedDate = new Date().toLocaleDateString('en-GB', options);
const adminContact=['+918115199076','+919899564481','+919870249076']
    const result = await createUserflightBooking(data);
    if(result.bookingStatus==bookingStatus.FAILED){
      const TemplateNames=['Flight',String(data.pnr),String(notObject.to),String(formattedDate)];
      await whatsApi.sendWhtsAppAISensyMultiUSer(adminContact,TemplateNames,'adminBookingFailure');
      return res.status(statusCode.OK).send({
        statusCode: statusCode.ReqTimeOut, 
        responseMessage: responseMessage.BOOKING_FAILED,
        // result,
      });

    }else{
      const TemplateNames=[String(notObject.from),String(data.pnr),String(notObject.to),String(formattedDate)];
      await whatsApi.sendWhtsAppOTPAISensy(adminContact,TemplateNames,'admin_booking_Alert');
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
    return res.status(statusCode.OK).send({statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED,result, });
 
    }
     } catch (error) {
    return next(error);
  }
};

exports.getUserflightBooking = async (req, res, next) => {
  try {
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
    const result = await aggregatePaginateGetBooking(body);
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
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
    const result = await findUserflightBookingData({ status: status.ACTIVE,userId:isUserExist._id });
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

exports.sendPDF=async(req,res,next)=>{
  try {
    const {ticketId,email}=req.body;
    const isUserExist = await findUser({
      _id: req.body.username,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result=await findUserflightBooking({_id:ticketId});
    const phone = '+91'+result?.passengerDetails[0]?.ContactNo;
     const userName = `${result?.passengerDetails[0]?.firstName} ${result?.passengerDetails[0]?.lastName}`;
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
       const depDate=new Date(result.airlineDetails[0].Origin.DepTime);
    const depTime=new Date(result.airlineDetails[0].Origin.DepTime);
    const arrTime=new Date(result.airlineDetails[0].Destination.ArrTime);
    const templates=[String(userName),String(result.pnr),String(result.airlineDetails[0].Airline.AirlineName),String(depDate.toLocaleDateString('en-GB', options)),String(depTime.toLocaleTimeString('en-GB')),String(arrTime.toLocaleTimeString('en-GB')),String(result.totalAmount)];
    await whatsApi.sendWhtsAppOTPAISensy('9870249076',templates,"flightBooking");
    await commonFunction.FlightBookingConfirmationMailWithNewEmail(result,email);
    return res
    .status(statusCode.OK)
    .send({statusCode:statusCode.OK, message: responseMessage.PDF_SENT});
    
  } catch (error) {
    return next(error)
  }
};


exports.sendUpdateToUser = async (req, res, next) => {
  try {
    const { userId, bookingId } = req.body;
    const isUserExist = await findUser({ _id: userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isBookingExist = await findUserflightBooking({
      _id: bookingId,
      userId: isUserExist._id,
    });
    if (!isBookingExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const userName = `${isBookingExist.passenger[0].firstName} ${isBookingExist.passenger[0].lastName}`;
    const notificationTitle = `Dear ${isUserExist.username},`;
    const notificationMessage = `🥳 Woohoo! Your booking (PNR: ${isBookingExist.pnr}) is confirmed. Time to start packing! 💼`;
    const notObject = {
      userId: isUserExist._id,
      title: "Flight Booking by User",
      description: `New Booking form our platform🎊.🙂`,
      from: "FlightBookiing",
      to: userName,
    };
    let options = { day: "2-digit", month: "2-digit", year: "numeric" };
     const depDate=new Date(data.airlineDetails[0].Origin.DepTime);
    const depTime=new Date(data.airlineDetails[0].Origin.DepTime);
    const arrTime=new Date(data.airlineDetails[0].Destination.ArrTime);
    await createPushNotification(notObject);
    await pushNotificationAfterDepricate(
      isUserExist.deviceToken,
      notificationTitle,
      notificationMessage
    );
   const template=[String(userName),String(isBookingExist.pnr),String(isBookingExist.airlineDetails[0].Airline.AirlineName),String(depDate.toLocaleDateString('en-GB', options)),String(depTime.toLocaleTimeString('en-GB')),String(arrTime.toLocaleTimeString('en-GB')),String(isBookingExist.totalAmount)];
    await whatsApi.sendWhtsAppOTPAISensy(
      `+91${isBookingExist.passenger[0].Phone}`,
      template,
      "flightBooking"
    );
    await sendSMS.sendSMSBusBooking(
      isBookingExist.passenger[0].Phone,
      userName
    );
    // await commonFunction.BusBoo5kingConfirmationMail(isBookingExist);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SUCCESS,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getFlightBookingById=async(req,res,next)=>{
  try{
const response=await findUserflightBooking({_id:req.params.bookingId});
if(!response){
  return res.status(statusCode.OK).send({
    statusCode: statusCode.OK,
    message: responseMessage.DATA_NOT_FOUND,
  });
}
return res
.status(statusCode.OK)
.send({ statusCode:statusCode.OK,responseMessage: responseMessage.DATA_FOUND, result: response });
  }catch(error){
return next(error);
  }
}

exports.getFlightBookingByUserId =async (req, res,next) =>{

  try{

  const id=req.params.id;
  
 const result=await findUserflightBooking({_id:id});

  // return

  await commonFunction.FlightBookingConfirmationMail(result);
  return res.status(statusCode.OK).send({statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED,result, });


   } catch (error) {
  return next(error);
}
 
  

}

