const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AdminNumber=process.env.ADMINNUMBER;
/**********************************SERVICES********************************** */
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;

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
const {
  userBusBookingServices,
} = require("../../services/btocServices/busBookingServices");
const bookingStatus = require("../../enums/bookingStatus");
const {
  createUserBusBooking,
  findUserBusBooking,
  getUserBusBooking,
  findUserBusBookingData,
  deleteUserBusBooking,
  userBusBookingList,
  updateUserBusBooking,
  paginateUserBusBookingSearch,
} = userBusBookingServices;
const whatsApi = require("../../utilities/whatsApi");

exports.busBooking = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    const contactNo =`${isUserExist.phone.country_code}${isUserExist.phone.mobile_number}`
    if (!isUserExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.USERS_NOT_FOUND,
        });
    }
    data.userId=isUserExist._id
    const result = await createUserBusBooking(data);
    if(result.bookingStatus==bookingStatus.FAILED){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.ReqTimeOut, 
        responseMessage: responseMessage.BOOKING_FAILED,
        // result,
      });
    }else{
const userName =`${result.passenger[0].firstName} ${result.passenger[0].lastName}`;
    const notObject={
      userId:isUserExist._id,
      title:"Bus Booking by User",
      description:`New Booking form our platform🎊.🙂`,
      from:'busBookiing',
      to:userName,
    }
    // Define options for formatting the date
let options = { day: '2-digit', month: '2-digit', year: 'numeric' };

// Format the date using the toLocaleDateString() function
let formattedDate = new Date().toLocaleDateString('en-GB', options);
let journeyDate=new Date(data.departureTime);
await createPushNotification(notObject);
    // await sendSMS.sendSMSBusBooking(result.passenger[0].Phone, userName);
    const url=`https://theskytrails.com/busEticket/${result._id}`;
    const TemplateNames=[String(notObject.from),String(data.pnr),String(notObject.to),String(formattedDate)];
    // const TemplateNames1=[String(var1),String(var1)]
    await whatsApi.sendWhtsAppOTPAISensy(AdminNumber,TemplateNames,'admin_booking_Alert');
    const template=[String(data.origin),String(data.destination),String(data.pnr),String(journeyDate.toLocaleDateString('en-GB', options)),String(data.noOfSeats),String(data.BoardingPoint.Location)]
    await whatsApi.sendWhtsAppOTPAISensy(contactNo,template,'busBooking');
    await commonFunction.BusBookingConfirmationMail(result);
    if (result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.BUS_BOOKING_CREATED,
          result: result,
        });
        
    }
    }
    
    
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

exports.getBusBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.OK)
        .send({
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
    const result = await paginateUserBusBookingSearch(body);
    // console.log("result=========", result);
    if (result.docs.length == 0) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

//************GETALL BUSBOKING DETAILS****************/


exports.getUserBusData = async (req, res, next) => {
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    // console.log("isUSerExist", isUserExist);
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }

    const result = await userBusBookingList({ status: status.ACTIVE,userId:isUserExist._id });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

exports.getUserBusBookingById=async(req,res,next)=>{
  try {
    const response=await findUserBusBooking({_id:req.params.bookingId});
    if(!response){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
    .status(statusCode.OK)
    .send({ statusCode:statusCode.OK,responseMessage: responseMessage.DATA_FOUND, result: response });
  } catch (error) {
    console.log("Error======================",error);
    return next(error)
  }
}