

const CrmAgentBusBooking = require("../model/crmAgentBusBooking.model");

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


exports.createCrmAgentBusBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const response = await CrmAgentBusBooking.create(data);
    const msg = "bus booking details added successfully";

   
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};






//getAgentSingleBusBooking

exports.getAgentSingleBusBooking = async (req, res) => {
  try {
    const id=req.query.id;

    const  bus = await CrmAgentBusBooking.findById(id);
    
    // console.log(bus);
    if (!bus) {
      return res.status(404).send({
        statusCode: 404,
        message: "No bus found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Get user bus fetch successfully",
      data: bus,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//getAgentBusBookingDataWithPagination

exports.getAgentBusBookingDataWithPagination = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const sorted = { createdAt: -1 };
      const query = {
        userId : req.query.userId
      };
  
      const busdata = await exports.AgentBusBookingServicesWithPagination(
        page,
        limit,
        sorted,
        query
      );
  
      // console.log(user);
      if (busdata.data.length === 0) {
        return res.status(404).send({
          statusCode: 404,
          message: "No bus found for this criteria",
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        message: "Get all user bus fetch successfully",
        meta: busdata.meta,
        data: busdata.data,
      });
    } catch (err) {
      const errorMsg = err.message || "Unknown error";
      res.status(500).send({ statusCode: 500, message: errorMsg });
    }
  };

// AgentBusBookingServicesWithPagination
exports.AgentBusBookingServicesWithPagination = async (page, limit, sorted, query) => {
    try {
      const skip = (page - 1) * limit;
  
      const [data, total] = await Promise.all([
        CrmAgentBusBooking.find(query)
          .sort(sorted)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .lean().select("-__v"),
  
        CrmAgentBusBooking.countDocuments(query),
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