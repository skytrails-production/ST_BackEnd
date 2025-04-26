

const CrmAgentFlightBooking = require("../model/crmAgentFlightBooking.model");

const Notification = require("../model/notification.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const sendSMSUtils = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const { sendWhatsAppMessage } = require("../utilities/whatsApi");
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");
const whatsApi = require("../utilities/whatsApi");
const hawaiYatra = require("../utilities/b2bWhatsApp");


exports.createCrmAgentFllghtBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
      paymentStatus:"success"
    };
    const response = await CrmAgentFlightBooking.create(data);
    const msg = "flight booking details added successfully";

    // if (response.bookingStatus === "BOOKED") {
    //   const userName =
    //     response.passengerDetails[0].firstName +
    //     " " +
    //     response.passengerDetails[0].lastName;
    //   const message = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://b2b.theskytrails.com/Login`;
    //   // await whatsAppMsg.sendWhatsAppMessage(response.passengerDetails[0].ContactNo, message);
    //   await hawaiYatra.sendWhtsAppAISensy(
    //     "+91" + data.passengerDetails[0].ContactNo,
    //     [String("Flight")],
    //     "booking_confirmation"
    //   );
    //   const send = await sendSMS.sendSMSForFlightBookingAgent(response);
    //   await commonFunction.FlightBookingConfirmationMail(response);
    // }
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};






//getAgentSingleFlightBooking

exports.getAgentSingleFlightBooking = async (req, res) => {
  try {
    const id=req.query.id;

    const flight = await CrmAgentFlightBooking.findById(id);


    // console.log(flight);
    if (!flight) {
      return res.status(404).send({
        statusCode: 404,
        message: "No flight found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Get all user flight fetch successfully",
      data: flight,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};


//getAgentBusBookingDataWithPagination

exports.getAgentFlightBookingDataWithPagination = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const sorted = { createdAt: -1 };
      const query = {
        userId : req.query.userId
      };
  
      const busdata = await exports.AgentFlightBookingServicesWithPagination(
        page,
        limit,
        sorted,
        query
      );
  
      // console.log(busdata);
      if (busdata.data.length === 0) {
        return res.status(404).send({
          statusCode: 404,
          message: "No flight found for this criteria",
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        message: "Get all user flight fetch successfully",
        meta: busdata.meta,
        data: busdata.data,
      });
    } catch (err) {
      const errorMsg = err.message || "Unknown error";
      res.status(500).send({ statusCode: 500, message: errorMsg });
    }
  };

// AgentFlightBookingServicesWithPagination
exports.AgentFlightBookingServicesWithPagination = async (page, limit, sorted, query) => {
    try {
      const skip = (page - 1) * limit;
  
      const [data, total] = await Promise.all([
        CrmAgentFlightBooking.find(query)
          .sort(sorted)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .lean().select("-__v"),
  
          CrmAgentFlightBooking.countDocuments(query),
      ]);
  
      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      // Create the pagination object
      const meta = {
        page,
        limit,
        totalPages,
        totalRecords: total,
      };
      return { data, meta };
    } catch (error) {
      throw new Error(error.message);
    }
  };