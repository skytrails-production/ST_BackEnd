const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");





//*****************************************SERVICES************************************************/
const {eventServices}=require("../../services/btocServices/eventBookingServices");
const {createEvent,findEventData,deleteEvent,EventList,updateEvent,countTotalEvent,}=eventServices;
const {userServices}=require("../../services/userServices");
const {createUser,findUser,getUser,findUserData,deleteUser,updateUser}=userServices;
const {transactionModelServices}=require("../../services/btocServices/transactionServices");
const {createUsertransaction,findUsertransaction,getUsertransaction,deleteUsertransaction,userUsertransactionList,updateUsertransaction,countTotalUsertransaction}=transactionModelServices;

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



