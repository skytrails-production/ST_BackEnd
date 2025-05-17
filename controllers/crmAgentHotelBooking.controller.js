const cron = require("node-cron");

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
const { autoCancellationGrnHoldHotel } = require("./grnconnect.controller");
const { isCancel } = require("axios");


exports.createCrmAgentHotelBooking = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

   const isExistingData= await CrmAgentHotelBooking.findOne(req.body);
    if(isExistingData) {
      return res.status(409).send({
        statusCode: 409,
        message: "Booking already exists.",
      });
    }
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

exports.getSingleHotelBookingBookingReference = async (bookingReference) => {
  try {
    // console.log(bookingReference,"bookingRefernece");
    const  hotel = await CrmAgentHotelBooking.findOne({'booking_reference':bookingReference});
    
    // console.log(hotel);
    if (!hotel) {
      return res.status(404).send({
        statusCode: 404,
        message: "No hotel found for this criteria",
      });
    }

   return hotel;
  } catch (err) {
    return 'something went wrong'
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


   //cancellhold hotel 

  const  autoCancellGrnHotelHold = async (todayTime, tomorrow)=> {
    try {

      const page =  1;
      const limit =  10000;
      const sorted = { createdAt: -1 };
      const query = {        
        isHold : true,
        isCancel : false,
        "hotel.cancellation_policy.cancel_by_date": { $gt: todayTime,$lt: tomorrow }
      };
  
      const hoteldata = await exports.AgentHotelBookingServicesWithPagination(
        page,
        limit,
        sorted,
        query
      );

      if(hoteldata.data.length>0){
        // console.log(hoteldata.data,"found result");

      await processAllBookings(hoteldata.data);
      return hoteldata.data;
      }else{
        // console.log("No record to cancel booking");
        return "No Data Found."
      }
      
    } catch (error) {
      
    }

      
  }
const processAllBookings = async (hoteldata) => {
  for (const booking of hoteldata) {
    const reference = booking.booking_reference;
    if (reference) {
      // console.log(reference,"bookingReference")
      const hotelData = await exports.getSingleHotelBookingBookingReference(reference);
      // console.log(hotelData,"hotel data");
      const res = await autoCancellationGrnHoldHotel(reference);
      // console.log('res', res);
      if(res==='confirmed'){
        // console.log('hhhhh',hotelData.isCancel);
        hotelData.isCancel = true;
       await hotelData.save();
      //  console.log('change',hotelData.isCancel);
      }
      
      return res;
    }
  }
};


const task = cron.schedule("0 4 * * *", async () => {
  const currentDate = new Date();
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1); // +1 day
 
   
    const data = await autoCancellGrnHotelHold(currentDate.toISOString(),tomorrow.toISOString());
    // console.log("final data",data);


}, {
  scheduled: true,
  timezone: "Asia/Kolkata"  // Indian Standard Time
});