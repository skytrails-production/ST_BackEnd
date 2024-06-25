const flightBookingData = require("../model/flightBookingData.model");
const amadeusFlightBookingData = require("../model/flightBookingAmadeus.model");
const User = require("../model/user.model");
const Notification = require("../model/notification.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const crypto = require("crypto");
const commonFunction = require("../utilities/commonFunctions");
const { sendWhatsAppMessage } = require('../utilities/whatsApi');
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");
const whatsAppMsg = require("../utilities/whatsApi");
const hawaiYatra=require("../utilities/b2bWhatsApp")
const { cancelBookingServices } = require("../services/cancelServices");
const { createcancelBooking, updatecancelBooking, aggregatePaginatecancelBookingList, countTotalcancelBooking } = cancelBookingServices;
exports.addFlightBookingData = async (req, res) => {
  try {

      const data={
        ...req.body,
        bookingStatus:"BOOKED",
      }
    const response = await flightBookingData.create(data);
    const msg = "flight booking details added successfully";

    if(response.bookingStatus === "BOOKED"){
    
     const userName = response.passengerDetails[0].firstName +" "+ response.passengerDetails[0].lastName;
     const message = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://b2b.theskytrails.com/Login`
      // await whatsAppMsg.sendWhatsAppMessage(response.passengerDetails[0].ContactNo, message);
      await hawaiYatra.sendWhtsAppAISensy('+91'+data.passengerDetails[0].ContactNo,[String("Flight")],"booking_confirmation");
      const send = await sendSMS.sendSMSForFlightBookingAgent(response);
      await commonFunction.FlightBookingConfirmationMail(response);
    }
    actionCompleteResponse(res, response, msg);
  } catch (error) {  
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.EmailTicket= async (req, res) => {
  const data=req.body;
  // console.log(data,"id")
    try{
    const response = await flightBookingData.findById({_id:data.TicketId});
    await commonFunction.FlightBookingConfirmationMailWithNewEmail(response,data.emailTicket);
    const msg="PDF sent successfully to your email. Please check your inbox."

    actionCompleteResponse(res, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }

}


exports.emailTicketWithMarkup= async (req, res) => {
  const id=req.body.TicketId;
  const markup=req.body;
  // console.log(req.body,"body");
    try{
    const response = await flightBookingData.findById({_id:id});
    // console.log(response,markup,"response")
    
    await commonFunction.FlightBookingConfirmationMailwithAgentMarkup(response,markup);
    const msg="PDF sent successfully to your email. Please check your inbox."

    actionCompleteResponse(res, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }

}

exports.getAllFlightsBooking = async (req, res) => {
  try {
    const response = await flightBookingData.find();
    const msg = "successfully get all flights bookings";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
exports.deleteFlightBookings = async (req, res) => {
  try {
    response = await flightBookingData.remove({
      userId: { $in: [req.params.id] },
    });
    const msg = "user booking data deleted successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
exports.deleteAllFlightBookings = async (req, res) => {
  try {
    response = await flightBookingData.destroy();
    const msg = "All booking data deleted successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.getoneFlightsBooking = async (req, res) => {
  try {
    response = await flightBookingData.find({
      userId: { $in: [req.params.id] },
    });
    // console.log(response,"response");
    const msg = "user booking data get successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.getoneFlightsBookingById = async (req, res) => {
  try {
    response = await flightBookingData.find({
      _id: { $in: [req.params.id] },
    });
    // console.log(response,"response");
    const msg = "user booking data get successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//==========================================================================
// ===== Send Flight booking Cencel Request For User to admin ==============
//==========================================================================

exports.sendFlightBookingCencelRequestForAdmin = async (req, res) => {
  try {
    const { pnr_no } = req.params;

    // Check if the booking with the given PNRNO exists
    const booking = await flightBookingData.findOne({ pnr: pnr_no });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      const isAdmin = await User.find({ userType: "ADMIN", status: "ACTIVE" }).select('-_id email username');
      const emailMessage = `Flight Booking Cancellation Request\n\nFlightName: ${booking.flightName}\nPnrNumber: ${booking.pnr}\nEmail: ${booking.passengerDetails[0].email}\nBooking Date: ${booking.createdAt}`;
      const payload = {
        email: isAdmin[0].email,
        message: emailMessage,
      };
      await commonFunction.flightBookingCencelRequestForAdmin(payload);
      const notifyDetails = {
        from: userId,
        title: "Flight Booking Cancellation Request!",
        description: emailMessage,
      };
      await Notification.create(notifyDetails);
      await PushNotification.sendNotification(notifyDetails);
      return res
        .status(200)
        .json({ message: "Booking Cancellation Request successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//=====================================================
//================ Get All Flight Booking List for Admin ========
//=====================================================

exports.getAllFlghtBookingForAdmin = async (req, res) => {
  try {
    const { Status } = req.body;
    let response;
    if (Status === "success") {
      response = await flightBookingData.find({
        paymentStatus: "success",
      });
    } else if (Status === "pending") {
      response = await flightBookingData.find({
        paymentStatus: "pending",
      });
    } else if (Status === "failure") {
      response = await flightBookingData.find({
        paymentStatus: "failure",
      });
    } else {
      response = await flightBookingData.find({});
      const msg = "successfully get all flights bookings";
      actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//================================================================
//============= Get Monthly Flight Booking Passenger Calender ====
//================================================================

exports.getMonthlyFlightBookingPassengerCalendar = async (req, res) => {
  try {
    var { year, month } = req.body;
    month = parseInt(month);
    let response;

    if (year && month) {
      // If year and month are provided, retrieve data for the specified month and year.
      response = await flightBookingData.find({
        createdAt: {
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 1),
        },
      });
    } else {
      // If year and month are not provided, retrieve data for the current month and year.
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      response = await flightBookingData.find({
        createdAt: {
          $gte: new Date(currentYear, currentMonth - 1, 1),
          $lte: new Date(currentYear, currentMonth, 1),
        },
      });
    }

    // Respond with the data
    const msg = "successfully get all Passegers";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


//================================================================
//============= Amadeus Flgiht Booking ====
//================================================================

exports.amadeusFlightBooking = async (req, res) =>{

  try {

    const data={
      ...req.body,
      bookingStatus:"BOOKED",
    }
  const response = await amadeusFlightBookingData.create(data);
  const msg = "flight booking details added successfully";

  // if(response.bookingStatus === "BOOKED"){
  
  //  const userName = response.passengerDetails[0].firstName +" "+ response.passengerDetails[0].lastName;
  //  const message = `Hello,${userName}.We appreciate your flight booking with The HawaiYatra. Your booking has been verified! Click the following link to view details:https://b2b.theskytrails.com/Login`
  //   // await whatsAppMsg.sendWhatsAppMessage(response.passengerDetails[0].ContactNo, message);
  //   await hawaiYatra.sendWhtsAppAISensy('+91'+data.passengerDetails[0].ContactNo,[String("Flight")],"booking_confirmation");
  //   const send = await sendSMS.sendSMSForFlightBookingAgent(response);
  //   await commonFunction.FlightBookingConfirmationMail(response);
  // }
  actionCompleteResponse(res, response, msg);
} catch (error) {  
  sendActionFailedResponse(res, {}, error.message);
}

}



//get all amadeus flight booking


exports.allAmaduesAgentBooking = async (req, res) =>{
  try{
    const response=await amadeusFlightBookingData.find();

    actionCompleteResponse(res, response, "Amadues flight booking fetch successfully");
  } catch (error) {  
    sendActionFailedResponse(res, {}, error.message);
  }



}




exports.updateAmadeusTicket = async (req, res ) =>{

  const { bookingId, passengerDetails } = req.body;

  try {

    const updatePromises = passengerDetails.map(async (passenger) => {
      const result = await amadeusFlightBookingData.updateOne(
          { _id: bookingId, 'passengerDetails._id': passenger._id },
          { $set: { 'passengerDetails.$.TicketNumber': passenger.TicketNumber } }
      );
      return result.modifiedCount;
  });

  const updateResults = await Promise.all(updatePromises);

  actionCompleteResponse(res, updateResults, "update Ticket");
    
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}