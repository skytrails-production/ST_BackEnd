const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");




//*****************************************SERVICES************************************************/
const {eventServices}=require("../../services/eventServices");
const {createEvent,findEventData,deleteEvent,EventList,updateEvent,countTotalEvent,}=eventServices;
const {userServices}=require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,deleteUser,updateUser}=userServices;
const {transactionModelServices}=require("../../services/btocServices/transactionServices");
const {createUsertransaction,findUsertransaction,getUsertransaction,deleteUsertransaction,userUsertransactionList,updateUsertransaction,countTotalUsertransaction}=transactionModelServices;
const {eventBookingServices}=require("../../services/btocServices/eventBookingServices");
const {createBookingEvent,findBookingEventData,deleteBookingEvent,eventBookingList,updateBookingEvent,countTotalBookingEvent,getBookingEvent}=eventBookingServices;


exports.eventBooking=async(req,res,next)=>{
    try {
        // noOfMember userId transactionId eventId tickets[{ticketNumber}]
        const {price,eventDate,adults,child,couple,eventId,transactionId,startTime,EndTime}=req.body;
        const isUserExist = await findUserData({ _id: req.userId,status:status.ACTIVE});
        if (!isUserExist) {
          return res
            .status(statusCode.NotFound)
            .send({
              statusCode: statusCode.NotFound,
              message: responseMessage.USERS_NOT_FOUND,
            });
        }
        const isEventExist=await findEventData({_id:eventId});
        if(!isEventExist){
            return res
            .status(statusCode.NotFound)
            .send({
              statusCode: statusCode.NotFound,
              message: responseMessage.EVENT_NOT_FOUND,
            });
        }
        console.log("isEventExist====",isEventExist)
        if(isEventExist){

        }

    } catch (error) {
        console.log("error while booking event",error);
        return next(error)
    }
}

exports.bookFreeEvents = async (req, res, next) => {
  try {
    const { eventDate, adults, child, couple, eventId, startTime, endTime,noOfMember } = req.body;
    const isUserExist = await findUserData({ _id: req.userId, status: status.ACTIVE });

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
    const selectedSlot = isEventExist.slot.find(slot => slot.startTime === startTime && slot.isAvailable);
    console.log("selectedSlot========>>>>>>>",selectedSlot)
    if (selectedSlot) {
      const updatedSlot=await updateEvent({_id: eventId, "slot.startTime": startTime},{ $set: { "slot.$.isAvailable": false } })
      // const generatedString=isEventExist._id+Date.now()
      const ticketNumber=await generateUniqueRandomString(15);
      console.log("generateTicket======",generatedString)
      console.log("ticketNumber==========>>>>>",ticketNumber);
      const object={
        userId:isUserExist._id,
        noOfMember:noOfMember,
        adults:adults,
        child:child,
        couple:couple,
        eventDate:eventDate,
        eventId:eventId,
        tickets:[ticketNumber]
      }
      console.log("object==========",object)
      const makeBooking=await createBookingEvent(object);
      console.log("makeBooking=============",makeBooking);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: 'Slot booked successfully.',
        result:makeBooking
      });
    } else {
      // Slot is not available
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: 'Slot is not available.',
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
  const randomPart = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  const timestampPart = Date.now().toString();
  const uniqueString = randomPart + timestampPart;

  return uniqueString.slice(0, length);
}
