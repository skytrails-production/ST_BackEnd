

const CrmAgentHotelBooking = require("../model/crmAgentHotelBooking.model");

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


exports.createCrmAgentHotelBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const response = await CrmAgentHotelBooking.create(data);
    const msg = "hotel booking details added successfully";

   
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};






//getAgentSingleHotelBooking

exports.getAgentSingleHotelBooking = async (req, res) => {
  try {
    const id=req.query.id;

    const  hotel = await CrmAgentHotelBooking.findById(id);
    
    // console.log(hotel);
    if (!hotel) {
      return res.status(404).send({
        statusCode: 404,
        message: "No hotel found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Get user hotel fetch successfully",
      data: hotel,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//getAgenthotelBookingDataWithPagination

exports.getAgentHotelBookingDataWithPagination = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const sorted = { createdAt: -1 };
      const query = {
        userId : req.query.userId
      };
  
      const hoteldata = await exports.AgentHotelBookingServicesWithPagination(
        page,
        limit,
        sorted,
        query
      );
  
      // console.log(hoteldata);
      if (hoteldata.data.length === 0) {
        return res.status(404).send({
          statusCode: 404,
          message: "No hotel found for this criteria",
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        message: "Get all user hotel fetch successfully",
        meta: hoteldata.meta,
        data: hoteldata.data,
      });
    } catch (err) {
      const errorMsg = err.message || "Unknown error";
      res.status(500).send({ statusCode: 500, message: errorMsg });
    }
  };

// AgentHotelBookingServicesWithPagination
exports.AgentHotelBookingServicesWithPagination = async (page, limit, sorted, query) => {
    try {
      const skip = (page - 1) * limit;
  
      const [data, total] = await Promise.all([
        CrmAgentHotelBooking.find(query)
          .sort(sorted)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .lean().select("-__v"),  
        CrmAgentHotelBooking.countDocuments(query),
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