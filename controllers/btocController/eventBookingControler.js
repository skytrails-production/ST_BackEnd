const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const paymentStatus = require("../../enums/paymentStatus");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const commonPushFunction=require("../../utilities/commonFunForPushNotification")
const whatsappAPIUrl = require("../../utilities/whatsApi");
const AdminNumber=process.env.ADMINNUMBER;
const moment=require('moment');
var CurrentDate = moment().format();
const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification
} = require("../../utilities/commonFunForPushNotification"); 
//*****************************************SERVICES************************************************/
const { eventServices } = require("../../services/eventServices");
const {
  createEvent,
  findEventData,
  deleteEvent,
  EventList,
  updateEvent,
  countTotalEvent,
} = eventServices;
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  deleteUser,
  updateUser,
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
  countTotalUsertransaction,
} = transactionModelServices;
const {
  eventBookingServices,
} = require("../../services/btocServices/eventBookingServices");
const {
  createBookingEvent,
  findBookingEventData,
  deleteBookingEvent,
  eventBookingList,
  updateBookingEvent,
  countTotalBookingEvent,
  eventBookingListPopulated,
  getBookingEvent,
} = eventBookingServices;

const {
  couponServices,
} = require("../../services/btocServices/couponServices");
const offerType = require("../../enums/offerType");
const {
  createCoupon,
  findCoupon,
  getCoupon,
  findCouponData,
  deleteCoupon,
  couponList,
  updateCoupon,
  paginateCouponSearch,
} = couponServices;
const {skyEventBookingServices}=require("../../services/btocServices/skyTrailsEventBooking");
const{createBookingSkyEvent,findBookingSkyEventData,deleteBookingSkyEvent,skyeventBookingList,skyeventBookingListPopulated,updateBookingSkyEvent,countTotalBookingSkyEvent,getBookingSkyEvent,getEventBookingByAggregate}=skyEventBookingServices
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const { stringify } = require("querystring");
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;


exports.eventBooking1 = async (req, res, next) => {
  try {
    const {
      price,
      eventDate,
      adults,
      child,
      couple,
      eventId,
      transactionId,
      startTime,
      noOfMember,
    } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isEventExist = await findEventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_NOT_FOUND,
      });
    }
    const selectedSlot = isEventExist.slot.find(
      (slot) => slot.startTime === startTime && slot.isAvailable === true
    );
    if (!selectedSlot) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SLOT_NOT_AVAILABLE,
      });
    }
    if (isEventExist.price >= 1) {
      if (!transactionId) {
        return res.status(statusCode.badRequest).send({
          statusCode: statusCode.badRequest,
          responseMessage: "transactionId  is required",
        });
      }
    }
    if (transactionId) {
      const isPaid = await findUsertransaction({
        _id: transactionId,
        userId: isUserExist._id,
        transactionStatus: paymentStatus.SUCCESS,
      });
      if (!isPaid) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.TRANSACTION_NOT_FOUND,
        });
      }
      if (selectedSlot.peoples < 1) {
        await updateEvent(
          { _id: eventId, "slot.startTime": startTime },
          { $set: { "slot.$.isAvailable": false } }
        );
      } else {
        await updateEvent(
          { _id: eventId, "slot.startTime": startTime },
          { $inc: { "slot.$.peoples": -noOfMember } }
        );
      }
      const object = {
        userId: isUserExist._id,
        email: isUserExist.email,
        contactNo: { mobile_number: isUserExist.phone.mobile_number },
        noOfMember: noOfMember,
        adults: adults,
        child: child,
        couple: couple,
        eventDate: eventDate,
        eventId: eventId,
        price: price,
        transactionId: transactionId,
        tickets: [],
      };
      for (var i = 0; i < noOfMember; i++) {
        const ticketNumber = await generateUniqueRandomString(15);
        object.tickets.push(ticketNumber);
      }
      const mobileNo =
        isUserExist.phone.country_code + isUserExist.phone.mobile_number;
      const makeBooking = await createBookingEvent(object);
      const message = `Hello ${fullName} ,Thank you for enquiry of your package stay with TheSkytrails. Please click on url to see details:. Or You Can login theskytrails.com/login`;
      await sendSMS.sendSMSPackageEnquiry(mobileNo, isUserExist.username);
      // await whatsApi.sendWhatsAppMessage(result.contactNumber.phone, message);
      // await commonFunction.packageBookingConfirmationMail(populatedResult);

      await updateEvent({ _id: eventId }, { $inc: { saleCount: +noOfMember } });
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.SLOT_BOOKED,
        result: makeBooking,
      });
    }
    if (selectedSlot.peoples < 1) {
      await updateEvent(
        { _id: eventId, "slot.startTime": startTime },
        { $set: { "slot.$.isAvailable": false } }
      );
    } else {
      await updateEvent(
        { _id: eventId, "slot.startTime": startTime },
        { $inc: { "slot.$.peoples": -noOfMember } }
      );
    }
    const object = {
      userId: isUserExist._id,
      noOfMember: noOfMember,
      adults: adults,
      child: child,
      couple: couple,
      eventDate: eventDate,
      eventId: eventId,
      tickets: [],
    };
    const makeBooking = await createBookingEvent(object);
    const mobileNo =
      isUserExist.phone.country_code + isUserExist.phone.mobile_number;
    const message = `Hello ${fullName} ,Thank you for enquiry of your package stay with TheSkytrails. Please click on url to see details:. Or You Can login theskytrails.com/login`;
    await sendSMS.sendSMSPackageEnquiry(mobileNo, isUserExist.username);
    // await whatsApi.sendWhatsAppMessage(result.contactNumber.phone, message);
    // await commonFunction.packageBookingConfirmationMail(populatedResult);
    await updateEvent({ _id: eventId }, { $inc: { saleCount: +noOfMember } });
    for (var i = 0; i < noOfMember; i++) {
      const ticketNumber = await generateUniqueRandomString(15);
      object.tickets.push(ticketNumber);
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SLOT_BOOKED,
      result: makeBooking,
    });
  } catch (error) {
    return next(error);
  }
};

exports.bookFreeEvents = async (req, res, next) => {
  try {
    const {
      eventDate,
      adults,
      child,
      couple,
      eventId,
      startTime,
      noOfMember,
      profession
    } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });

    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isEventExist = await findEventData({ _id: eventId });
    if (!isEventExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_NOT_FOUND,
      });
    }
    const selectedSlot = isEventExist.slot.find(
      (slot) => slot.startTime === startTime && slot.isAvailable
    );
    if (selectedSlot) {
      const updatedSlot = await updateEvent(
        { _id: eventId, "slot.startTime": startTime },
        { $set: { "slot.$.isAvailable": false } }
      );
      const ticketNumber = await generateUniqueRandomString(15);
     
      const object = {
        userId: isUserExist._id,
        noOfMember: noOfMember,
        adults: adults,
        child: child,
        couple: couple,
        eventDate: eventDate,
        eventId: eventId,
        tickets: [ticketNumber],
      };
      const makeBooking = await createBookingEvent(object);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: "Slot booked successfully.",
        result: makeBooking,
      });
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SLOT_NOT_AVAILABLE,
      });
    }
  } catch (error) {
    return next(error);
  }
};


//*********************************PEFA EVENT BOOKING*****************************/
exports.eventBooking = async (req, res, next) => {
  try {
    const {name,mobileNumber,city,deviceToken,deviceType,eventDate,eventId,noOfMember,profession,bookingStatus} = req.body;
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});
    if (!isUserExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND,});
    }
    const isEventExist = await findEventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.EVENT_NOT_FOUND,});
    }
    const isBookingExist=await findBookingEventData({$and:[{userId:isUserExist._id,eventId:isEventExist._id}]});
    if(isBookingExist){
      return res.status(statusCode.OK).send({statusCode: statusCode.Conflict,responseMessage: responseMessage.EVENT_ALREADY_BOOKED,});
    }
    await updateEvent({ _id: eventId, "slot.startTime": "17:00" },{ $inc: { "slot.$.peoples": -noOfMember } });
    await updateUser({_id:isUserExist._id},{deviceToken:deviceToken});
    const object = {
      userId:isUserExist._id,
      name: name,
      bookingStatus:bookingStatus,
      contactNo: { mobile_number: mobileNumber },
      city: city,
      eventDate: isEventExist.startDate,
      eventId: eventId,
      deviceToken: deviceToken,
      deviceType:deviceType,
      profession:profession,
      tickets: [],
    };
    for (var i = 0; i < noOfMember; i++) {
       const ticketNumber = await generateUniqueRandomString(15);
    object.tickets.push(ticketNumber);
    }
    const result = await createBookingEvent(object);
    const eventname = isEventExist.title;
    const date = isEventExist.slot[0].startDate;
    const contactNo = "+91" + mobileNumber;
    const smsFormat = isEventExist.title;
    await sendSMS.sendSMSEventEnquiry(mobileNumber,smsFormat);
    const templates=[String(eventname)];
     const send=await whatsappAPIUrl.sendWhtsAppOTPAISensy(contactNo,templates,"eventBooking");
    await whatsappAPIUrl.sendMessageWhatsApp(contactNo,eventname,date,"event4_v3");
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SLOT_BOOKED,
      result: result,
    }); 
  } catch (error) {
    return next(error);
  }
};

exports.sendNotificationAfterBooking=async(req,res,next)=>{
  try {
    const{name,deviceToken}=req.body;
    const notificationMessage = `🎉 Your PEFA 2024 Booking Confirmation! 🎉`;
      const messageBody=`Dear ${name} 😎,We are pleased to inform you that your booking for PEFA 2024, an extraordinary night, is confirmed with Skytrails. We will be sharing more details soon, so stay tuned for regular updates on our app. See you at PEFA2024.Best Regards TheSkyTrails pvt ltd`
      const messageTitle="🌟🎉 Your PEFA 2024 Booking Confirmation! 🎉🌟";
      const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
      await commonPushFunction.pushNotificationAfterDepricate(deviceToken,messageTitle,messageBody,imageurl);
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.SUCCESS})
  } catch (error) {
   return next(error)
  }
}

exports.getEventBookingStatus=async(req,res,next)=>{
  try {
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});
    if (!isUserExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND});
    }
    const isBookingExist=await eventBookingListPopulated({userId:isUserExist._id});
    if(isBookingExist.length==0||!isBookingExist||isBookingExist===null){
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    // const dateMoment=
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:isBookingExist});
  } catch (error) {
    return next(error);
  }
}


exports.userEventBooking=async(req,res,next)=>{
  try {
    const {deviceToken,deviceType,eventId,price,noOfMember,bookingStatus,details,transactionId,isCoupanApplied, } = req.body;
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});    
    if (!isUserExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND,});
    }
    const isEventExist = await findEventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.EVENT_NOT_FOUND,});
    }
    const eventTitle=isEventExist.title.split("-");
    const match = isEventExist.venue.match(/\(Gate no\.\d+\)/);
    const passCollectionLocation=match ? match[0].replace(/[()]/g, "") : "";
    
    const isBookingExist=await findBookingSkyEventData({$and:[{userId:isUserExist._id,eventId:isEventExist._id}]});
    if(isBookingExist){
      return res.status(statusCode.OK).send({statusCode: statusCode.Conflict,responseMessage: responseMessage.EVENT_ALREADY_BOOKED,});
    }
    
    const query = [
      { 
        $match: { eventId:ObjectId("67a73faec50c7176c6840c3a")} 
      },
      { 
        $group: {
          _id: ObjectId("67a73faec50c7176c6840c3a"),  
          totalTickets: { $sum: { $size: "$tickets" } }
        } 
      }
    ];   
const totalTicket=await getEventBookingByAggregate(query);
    const object = {
      userId:isUserExist._id,
      bookingStatus:bookingStatus,
      eventDate: isEventExist.startDate,
      eventId: eventId,
      deviceToken: deviceToken,
      deviceType:deviceType,
      tickets: [],
      details: details,
      transactionId: transactionId,
      isCoupanApplied: isCoupanApplied || false,
      price: price
    };
    if(totalTicket>=500){
      object.isluckyUser=false
    }

    const startTime=isEventExist.slot[0].startTime;
 await updateBookingSkyEvent({ _id: eventId, "slot.startTime": startTime},{ $inc: { "slot.$.peoples": -noOfMember } });
    await updateUser({_id:isUserExist._id},{deviceToken:deviceToken});
 
    for (var i = 0; i < noOfMember; i++) {
      const ticketNumber = await generateUniqueRandomString(15);
   object.tickets.push(ticketNumber);
   }
 
  const result = await createBookingSkyEvent(object);
  const contactNo = `+91${result.details.contactNumber}`;
  const sendt=await sendSMS.sendSMSEventEnquiry(details.contactNumber,isEventExist.title);
  const eventDate = new Date(isEventExist.startDate);
  const localTime = eventDate.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", });
const temPlateParams=[ String(eventTitle[0]), String(eventTitle[0]), String(isEventExist.venue), String(moment(isEventExist.startDate).format("DD-MM-YYYY")), String(localTime), String(passCollectionLocation)]
const sent=await whatsappAPIUrl.sendWhtsAppOTPAISensy(contactNo,temPlateParams,"EventBookingConfirmation");

if(isUserExist.phone.mobile_number!==result.details.contactNumber){
  const sent=await whatsappAPIUrl.sendWhtsAppOTPAISensy(contactNo,temPlateParams,"EventBookingConfirmation");
  
}
// '+91'+data.phone,[String("Bus")],"booking_confirmation"
  return res.status(statusCode.OK).send({
    statusCode: statusCode.OK,
    responseMessage: responseMessage.SLOT_BOOKED,
    result: result,
  }); 
  } catch (error) {
    return next(error);
  }
}

exports.getEventBookingStatus1=async(req,res,next)=>{
  try {
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});
    if (!isUserExist) {
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND});
    }
    const isBookingExist=await skyeventBookingListPopulated({userId:isUserExist._id});
    if(isBookingExist.length==0||!isBookingExist||isBookingExist===null){
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.BOOKING_NOT_FOUND});
    }
    // const dateMoment=
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:isBookingExist});
  } catch (error) {
    return next(error);
  }
}
//*****************Geneerate all passes for eventBooking******************************************/
exports.sendUpdatePasses=async(req,res,next)=>{
  try {
    // deviceToken: { $exists: true, $ne: "" }
    const users = await eventBookingList({status: status.ACTIVE,isluckyUser:false});
    const result=[]
    for (const user of users) {
      // const data=[{
      //   contactNo:user.contactNo.mobile_number,
      //   name:user.name,
      //   profession:user.profession,
      //   ticketsNumber:user.tickets,
      //   city:user.city
      // }]
      // const base64=await qrcode.toDataURL(JSON.stringify(data));
      const smsFormat="Your Pass generate please visit into app ."
      const mobile=user.contactNo.country_code+user.contactNo.mobile_number
      const update=await updateBookingEvent({_id:user._id},{isluckyUser:true})
      result.push(update);
      await sendSMS.sendSMSPasses(user.contactNo.mobile_number);
      await whatsappAPIUrl.sendWhatsAppMsgAdminPackage(mobile,`${user.name}😎`,"pefa"); 
      if(user.deviceType==='andriod'){
        try {
        const notificationMessage=`Hey ${user.name}😎 You are booked!🎊`;
        const messageBody="🎉✨You're all set for the PEFA event. See you there for an unforgettable time.✨🎉";
        const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
        await pushNotificationAfterDepricate(user.deviceToken,notificationMessage,messageBody,imageurl);
      } catch (pushError) {
       
        continue;
      }
      }
    }
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.PASSES_SENT,result:result});

  } catch (error) {
    return next(error)
  }
}


//generate function**************************************************************************

async function generateUniqueRandomString(length) {
  const randomPart = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
  const timestampPart = Date.now().toString();
  const uniqueString = 'TST'+randomPart + timestampPart;

  return uniqueString.slice(0, length);
}



