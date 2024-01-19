const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const hotelBookingModel = require("../model/hotelBooking.model");
const Notification = require("../model/notification.model");
const User = require("../model/user.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const bookingStatus = require("../enums/bookingStatus");
const commonFunction = require("../utilities/commonFunctions");
const { log } = require("console");
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");
const whatsAppMsg = require("../utilities/whatsApi");

//****************************************SERVICES**************************************/
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking } = hotelBookingServicess;

exports.addHotelBookingData = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      destination: req.body.destination,
      bookingId: req.body.bookingId,
      CheckInDate: req.body.CheckInDate,
      CheckOutDate: req.body.CheckOutDate,
      hotelName: req.body.hotelName,
      noOfPeople: req.body.noOfPeople,
      hotelId: req.body.hotelId,
      cityName: req.body.cityName,
      country: req.body.country,
      room: req.body.room,
      amount: req.body.amount,
      bookingStatus: bookingStatus.BOOKED,
    };
    // console.log(data,"hotel data");

    const response = await hotelBookingModel.create(data);

    // console.log("response==========", response);
    const msg = "Hotel booking  successfully";
    if (response.bookingStatus === "BOOKED") {
      // await commonFunction.sendHotelBookingConfirmation(data);
      const message = `Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login`
      await sendSMS.sendSMSForHotelBookingAgent(response);
      await whatsAppMsg.sendWhatsAppMessage(data.phone, message);
      await commonFunction.HotelBookingConfirmationMail(response);

    }


    actionCompleteResponse(res, response, msg);

  } catch (error) {
    
    sendActionFailedResponse(res, {}, error.message);
  }
};
//=====================================================
// ===== Get Hotel booking ==
//=====================================================
exports.getoneHotelBookingById=async (req, res) => {
  try {
    response = await hotelBookingModel.find({
      _id: { $in: [req.params.id] },
    });
    // console.log(response,"response");
    const msg = "user booking data get successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};


exports.emailTicket= async (req, res) => {
  const data=req.body;
  // console.log(data,"id")
    try{
    const response = await hotelBookingModel.findById({_id:data.TicketId});
     await commonFunction.hotelBookingConfirmationMailWithNewEmail(response,data.emailTicket);
    const msg="PDF sent successfully to your email. Please check your inbox."

    actionCompleteResponse(res, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }

}


//=====================================================
// ===== Send Hotel booking Cencel Request For admin ==
//=====================================================

exports.sendHotelBookingCencelRequestForAdmin = async () => {
  try {
    const { bookingId } = req.params;

    // Check if the booking with the given bookingId exists
    const booking = await hotelBookingModel.findOne({ BookingId: bookingId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      const isAdmin = await User.find({ userType: "ADMIN", status: "ACTIVE" }).select('-_id email username');
      const emailMessage = `Hotel Booking Cancellation Request\n\nName: ${booking.name}\nEmail: ${booking.email}\nCheck-in Date: ${booking.CheckInDate}\nCheck-out Date: ${booking.CheckOutDate}`;
      const payload = {
        email: isAdmin[0].email,
        message: emailMessage,
      };
      await commonFunction.hotelBookingCencelRequestForAdmin(payload);
      const notifyDetails = {
        from: userId,
        title: "Hotel Booking Cancellation Request!",
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
//====== Get All Hotel booking List For Admin =========
//=====================================================

exports.getAllHotelBookingForAdmin = async (req, res) => {
  try {
    const { Status } = req.body;
    let response;
    if (Status === bookingStatus.BOOKED) {
      response = await hotelBookingModel.find({
        bookingStatus: bookingStatus.BOOKED,
      });
    } else if (Status === bookingStatus.PENDING) {
      response = await hotelBookingModel.find({
        bookingStatus: bookingStatus.PENDING,
      });
    } else if (Status === bookingStatus.CANCEL) {
      response = await hotelBookingModel.find({
        bookingStatus: bookingStatus.CANCEL,
      });
    } else {
      response = await hotelBookingModel.find({});
      const msg = "successfully get all flights bookings";
      actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
