const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const paymentStatus=require("../../enums/paymentStatus");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");
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
  getBookingEvent,
} = eventBookingServices;

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
    console.log("isEventExist=============",isEventExist)
    const selectedSlot = isEventExist.slot.find(
      (slot) => slot.startTime === startTime && slot.isAvailable === true
    );
    console.log("selectedSlot=========", selectedSlot);
    if (!selectedSlot) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SLOT_NOT_AVAILABLE,
      });
    }
    if(isEventExist.price>=1){
      if(!transactionId){
        return res.status(statusCode.badRequest).send({statusCode:statusCode.badRequest, responseMessage:"transactionId  is required"});
      }
     
    }
    if (transactionId) {
      const isPaid = await findUsertransaction({ _id: transactionId,userId:isUserExist._id,transactionStatus:paymentStatus.SUCCESS });
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
        email:isUserExist.email,
        contactNo:{mobile_number:isUserExist.phone.mobile_number},
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
      for(var i=0;i<noOfMember;i++){
        const ticketNumber = await generateUniqueRandomString(15);
        object.tickets.push(ticketNumber)
      }
      const mobileNo=isUserExist.phone.country_code+isUserExist.phone.mobile_number
      const makeBooking = await createBookingEvent(object);
      const message = `Hello ${fullName} ,Thank you for enquiry of your package stay with TheSkytrails. Please click on url to see details:. Or You Can login theskytrails.com/login`;
      await sendSMS.sendSMSPackageEnquiry(mobileNo,isUserExist.username);
      // await whatsApi.sendWhatsAppMessage(result.contactNumber.phone, message);
      // await commonFunction.packageBookingConfirmationMail(populatedResult);
  
      await updateEvent({_id:eventId},{$inc:{saleCount:+noOfMember}});
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
    const mobileNo=isUserExist.phone.country_code+isUserExist.phone.mobile_number
      const message = `Hello ${fullName} ,Thank you for enquiry of your package stay with TheSkytrails. Please click on url to see details:. Or You Can login theskytrails.com/login`;
      await sendSMS.sendSMSPackageEnquiry(mobileNo,isUserExist.username);
      // await whatsApi.sendWhatsAppMessage(result.contactNumber.phone, message);
      // await commonFunction.packageBookingConfirmationMail(populatedResult);
    await updateEvent({_id:eventId},{$inc:{saleCount:+noOfMember}})
    for(var i=0;i<noOfMember;i++){
      const ticketNumber = await generateUniqueRandomString(15);
      object.tickets.push(ticketNumber)
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
    console.log("selectedSlot========>>>>>>>", selectedSlot);
    if (selectedSlot) {
      const updatedSlot = await updateEvent(
        { _id: eventId, "slot.startTime": startTime },
        { $set: { "slot.$.isAvailable": false } }
      );
      // const generatedString=isEventExist._id+Date.now()
      const ticketNumber = await generateUniqueRandomString(15);
      console.log("generateTicket======", generatedString);
      console.log("ticketNumber==========>>>>>", ticketNumber);
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
      console.log("object==========", object);
      const makeBooking = await createBookingEvent(object);
      console.log("makeBooking=============", makeBooking);
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
  const uniqueString = randomPart + timestampPart;

  return uniqueString.slice(0, length);
}


//*********************************PEFA EVENT BOOKING*****************************/

exports.pefaEventBooking=async(req,res,next)=>{
  try {
    const {name,mobileNumber,city,deviceToken,eventDate,eventId}=req.body;
    const isEventExist=await findEventData({_id:eventId,status:status.ACTIVE});
    if (!isEventExist) {
      return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,message: responseMessage.EVENT_NOT_FOUND,});
    }
    await updateEvent(
      { _id: eventId, "slot.startTime": startTime },
      { $inc: { "slot.$.peoples": -1 } }
    );
     const object={
      name:name,mobileNumber:mobileNumber,city:city,eventDate:eventDate,eventId:eventId,deviceToken:deviceToken,tickets:[]
     }
     const ticketNumber = await generateUniqueRandomString(15);
     object.tickets.push(ticketNumber)
     const result= await createBookingEvent(object);
     console.log("result==>>",result);
     const eventname=isEventExist.title;
     const date='12-Mar-2024, 5pm'
     await sendSMS.sendSMSPackageEnquiry(mobileNo,isUserExist.username);
     await whatsApi.sendWhatsAppMessage(result.contactNumber.phone,eventname,date, 'event_2');
    await whatsappAPIUrl.sendMessageWhatsApp(result)
     
     return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SLOT_BOOKED,
      result: result,
    });
  } catch (error) {
    console.log("error while booking event",error);
    return  next(error)
  }
}