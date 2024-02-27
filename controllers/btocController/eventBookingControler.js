const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const paymentStatus = require("../../enums/paymentStatus");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const commonPushFunction=require("../../utilities/commonFunForPushNotification")
const whatsappAPIUrl = require("../../utilities/whatsApi");
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
const{pushNotificationServices}=require('../../services/pushNotificationServices');
const { stringify } = require("querystring");
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;


exports.eventBooking = async (req, res, next) => {
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
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isEventExist = await findEventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_NOT_FOUND,
      });
    }
    // console.log("isEventExist=============", isEventExist);
    const selectedSlot = isEventExist.slot.find(
      (slot) => slot.startTime === startTime && slot.isAvailable === true
    );
    // console.log("selectedSlot=========", selectedSlot);
    if (!selectedSlot) {
      return res.status(statusCode.NotFound).send({
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
        return res.status(statusCode.NotFound).send({
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
    console.log("error while booking event", error);
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
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isEventExist = await findEventData({ _id: eventId });
    if (!isEventExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_NOT_FOUND,
      });
    }
    const selectedSlot = isEventExist.slot.find(
      (slot) => slot.startTime === startTime && slot.isAvailable
    );
    // console.log("selectedSlot========>>>>>>>", selectedSlot);
    if (selectedSlot) {
      const updatedSlot = await updateEvent(
        { _id: eventId, "slot.startTime": startTime },
        { $set: { "slot.$.isAvailable": false } }
      );
      // const generatedString=isEventExist._id+Date.now()
      const ticketNumber = await generateUniqueRandomString(15);
      // console.log("generateTicket======", generatedString);
      // console.log("ticketNumber==========>>>>>", ticketNumber);
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
      // console.log("object==========", object);
      const makeBooking = await createBookingEvent(object);
      // console.log("makeBooking=============", makeBooking);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: "Slot booked successfully.",
        result: makeBooking,
      });
    } else {
      // Slot is not available
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SLOT_NOT_AVAILABLE,
      });
    }
  } catch (error) {
    console.log("error while booking event", error);
    return next(error);
  }
};


//*********************************PEFA EVENT BOOKING*****************************/
exports.pefaEventBooking = async (req, res, next) => {
  try {
    const {name,mobileNumber,city,deviceToken,deviceType,eventDate,eventId,noOfMember,profession} = req.body;
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isEventExist = await findEventData({
      _id: eventId,
      status: status.ACTIVE,
    });
    if (!isEventExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_NOT_FOUND,
      });
    }
    const isBookingExist=await findBookingEventData({userId:isUserExist._id,eventId:isEventExist._id});
    if(isBookingExist){
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.EVENT_ALREADY_BOOKED,
      });
    }
    await updateEvent(
      { _id: eventId, "slot.startTime": "17:00" },
      { $inc: { "slot.$.peoples": -noOfMember } }
    );
    await updateUser({_id:isUserExist._id},{deviceToken:deviceToken})
    const object = {
      userId:isUserExist._id,
      name: name,
      contactNo: { mobile_number: mobileNumber },
      city: city,
      eventDate: eventDate,
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
    const obj = {
      title: "Mohali",
      couponCode: "WELCOMEPEFA",
      content: "pefa2024 TheSkyTrails registration coupon",
      limitAmount: 100,
      discountPercentage: 5,
      offerType: offerType.EVENTS,
      termsAndCond: ["coupon will be apply upto 100rs/"],
    };
    const isCouponExist=await findCoupon({couponCode:"WELCOMEPEFA"});
    await whatsApi.sendWhatsAppMsgAdmin(AdminNumber,'adminbooking_alert');
    await whatsApi.sendWhatsAppMsgAdmin(AdminNumber,'adminalert');
    if(isCouponExist){
    const eventname = "*PEFA - Punjab Entertainment Festival and Awards!*";
    const eventDate1 = "*2 Mar 2024 5 pm*";
    const date = `${eventDate1}`;
    const contactNo = "+91" + mobileNumber;
    const smsFormat = `PEFA - Punjab Entertainment Festival and Awards! on 2 Mar 2024 5 pm`;
    await sendSMS.sendSMSEventEnquiry(mobileNumber,smsFormat);
    await whatsappAPIUrl.sendMessageWhatsApp(
      contactNo,
      eventname,
      date,
      "event4_v3"
    );
    const messageTitle="TheSkyTrails PEFA2024";
    // await commonPushFunction.pushNotification(result.deviceToken,messageTitle,messageBody);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SLOT_BOOKED,
      result: result,
    });
    }else{
      const createPefaCoupon = await createCoupon(obj);
    const eventname = "*PEFA Punjab Entertainment Festival and Awards!*";
    const eventDate1 = "2 Mar 2024 5pm";
    const date = `${eventDate1}`;
    const contactNo = "+91" + mobileNumber;
    const smsFormat = `PEFA - Punjab Entertainment Festival and Awards! on 2 Mar 2024 5pm`;
     await sendSMS.sendSMSEventEnquiry(mobileNumber,smsFormat);
    await whatsappAPIUrl.sendMessageWhatsApp(
      contactNo,
      eventname,
      date,
      "event4_v3"
    );
    // await commonPushFunction.pushNotification(deviceToken,messageTitle,messageBody)
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SLOT_BOOKED,
      result: result,
    });
    }
    
  } catch (error) {
    console.log("error while booking event", error);
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
      await commonPushFunction.pushNotification(deviceToken,messageTitle,messageBody,imageurl);
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.SUCCESS})
  } catch (error) {
   console.log("error while send notification"); 
   return next(error)
  }
}

exports.getEventBookingStatus=async(req,res,next)=>{
  try {
    const isUserExist = await findUserData({_id: req.userId,status: status.ACTIVE,});
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.USERS_NOT_FOUND});
    }
    const isBookingExist=await eventBookingListPopulated({userId:isUserExist._id});
    if(isBookingExist.length==0||!isBookingExist||isBookingExist===null){
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    // const dateMoment=
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:isBookingExist});
  } catch (error) {
    console.log("error while get pefaeventHistory",error);
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
      await sendSMS.sendSMSPasses(user.contactNo.mobile_number,smsFormat);
      await whatsappAPIUrl.sendWhatsAppMsgAdminPackage(mobile,`${user.name}😎`,"pefa"); 
      if(user.deviceType==='andriod'){
        try {
        const notificationMessage=`Hey ${user.name}😎 You are booked!🎊`;
        const messageBody="🎉✨You're all set for the PEFA event. See you there for an unforgettable time.✨🎉";
        const imageurl=`https://travvolt.s3.amazonaws.com/uploadedFile_1706947058271_pefaEvent.jpg`;
        await pushNotification(user.deviceToken,notificationMessage,messageBody,imageurl);
        console.log("pushNotification=================",user.name);
      } catch (pushError) {
        console.error(
          "Error while sending push notification to user:",
          pushError
        );
        continue;
      }
      }
    }
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result:result});

  } catch (error) {
    console.log("error while send passes===========",error);
    return next(error)
  }
}

//generate function**************************************************************************
// function generateRandomAlphanumeric(length) {
//   const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";

//   for (let i = 0; i < length; i++) {
//     const date = Date.now().toString();
//     const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
//     result += date + randomChar;
//   }
// // console.log("result============",result)
//   return result;
// }

// // Example usage:
// const generatedString = generateRandomAlphanumeric(12);
// console.log(generatedString);
async function generateUniqueRandomString(length) {
  const randomPart = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
  const timestampPart = Date.now().toString();
  const uniqueString = 'PEFA'+randomPart + timestampPart;

  return uniqueString.slice(0, length);
}

