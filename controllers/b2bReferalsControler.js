const db = require("../model");
const b2bUser = db.userb2b;
const mongoose = require("mongoose");
const shortid = require('shortid');
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const bookingStatus = require("../enums/bookingStatus");
//************SERVICES*************** */
const userType = require("../enums/userType");
const status = require("../enums/status");
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const {
  aggregatePaginateHotelBookingList,
  findhotelBooking,
  findhotelBookingData,
  deletehotelBooking,
  updatehotelBooking,
  hotelBookingList,
  countAgentTotalBooking,
  aggregatePaginateHotelBookingList1,
  aggregatePaginateHotelBookings,
} = hotelBookingServicess;
const { brbuserServices } = require("../services/btobagentServices");
const {
  createbrbuser,
  findbrbuser,
  findOne,
  getbrbuser,
  findbrbuserData,
  findbrbData,
  updatebrbuser,
  deletebrbuser,
  brbuserList,
  paginatebrbuserSearch,
  countTotalbrbUser,
} = brbuserServices;
const { visaServices } = require("../services/visaServices");
const {
  createWeeklyVisa,
  findWeeklyVisa,
  deleteWeeklyVisa,
  weeklyVisaList,
  updateWeeklyVisa,
  weeklyVisaListPaginate,
} = visaServices;
const { changeRequestServices } = require("../services/changeRequest");
const {
  createchangeRequest,
  findchangeRequest,
  findchangeRequestData,
  deletechangeRequest,
  changeRequestList,
  updatechangeRequest,
  paginatechangeRequestSearch,
  aggregatePaginatechangeRequestList,
  countTotalchangeRequest,
} = changeRequestServices;
const {
  changeHotelRequestServices,
} = require("../services/changeHotelRequestServices");
const {
  createchangeHotelRequest,
  findchangeHotelRequest,
  getchangeHotelRequest,
  deletechangeHotelRequest,
  changeHotelRequestList,
  updatechangeHotelRequest,
  paginatechangeHotelRequestSearch,
  aggregatePaginatechangeHotelRequestList,
  countTotalchangeHotelRequest,
} = changeHotelRequestServices;
const { changeBusRequestServices } = require("../services/changeBusRequest");
const {
  createchangeBusRequest,
  findchangeBusRequest,
  getchangeBusRequest,
  deletechangeBusRequest,
  changeBusRequestList,
  updatechangeBusRequest,
  paginatechangeBusRequestSearch,
  aggregatePaginatechangeBusRequestList,
  countTotalchangeBusRequest,
} = changeBusRequestServices;
//**********Necessary models***********/
const flightModel = require("../model/flightBookingData.model");
const hotelBookingModel = require("../model/hotelBooking.model");
const busBookingModel = require("../model/busBookingData.model");

const aws = require("aws-sdk");

//**************************************************START CREATE API LOGIC IMPLEMENTATION***********************************/
exports.shareAgentReferralCode=async(req,res,next)=>{
  try {
    const isUserExist = await findOne({
      _id: req.params.userId,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    // ?referral=${isUserExist.referralCode}
    const referralLink = `http://thehawaiyatra.com/Registration`;
    const referralLink1 = `${isUserExist.referralCode}`;
     // Shorten the referral link
     var result={}
     result.shortReferralLink = await shortenURL(referralLink1);
return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.LINK_GENERATED,result:result});
  } catch (error) {
    console.log("error while send code",error);
    return next(error);
  }
}

exports.getReferrals=async(req,res,next)=>{
  try {
    const isAgentExist=await findOne({_id: req.params.userId});
    if (!isAgentExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const allReferrals=await findbrbData({referrerCode:isAgentExist.referralCode});
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.LINK_GENERATED,result:allReferrals});

  } catch (error) {
    console.log("error while trying to get referrals");
    return next(error)
  }
}


exports.getReferalBookings = async (req, res, next) => {
  try {
    const finalResult = [];
    const agents=[];
    const isAgentExist = await findOne({ _id: req.params.userId,});
    if (!isAgentExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    agents.push(isAgentExist)
    if(isAgentExist.referralCode!==undefined){
      const allReferrals = await findbrbData({ referrerCode: isAgentExist.referralCode });
       for (const againts of allReferrals) {
      const result = {
        agentId:againts._id,
        agencyName: againts.agency_details.agency_name,
        agentName:againts.personal_details.first_name+againts.personal_details.last_name,
        flightBookings: 0,
        flightBookingRevenue: 0,
        hotelBookings: 0,
        hotelBookingRevenue: 0,
        busBookings: 0,
        busBookingRevenue: 0,
        totalRevenue: 0,
      };

      const flightBookings = await flightModel.find({ userId: againts._id });
      result.flightBookings = flightBookings.length;
      result.flightBookingRevenue = flightBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

      const hotelBookings = await hotelBookingModel.find({ userId: againts._id });
      result.hotelBookings = hotelBookings.length;
      result.hotelBookingRevenue = hotelBookings.reduce((acc, curr) => acc + curr.amount, 0);

      const busBookings = await busBookingModel.find({ userId: againts._id });
      result.busBookings = busBookings.length;
      result.busBookingRevenue = busBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

      result.totalRevenue = result.flightBookingRevenue + result.hotelBookingRevenue + result.busBookingRevenue;

      finalResult.push(result);
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      agentInviteData: finalResult,agentDetails:agents
    });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      agentDetails:agents
    });
  } catch (error) {
    console.log("error while trying to get ==========", error);
    return next(error);
  }
};


async function shortenURL(url) {
  // Here, you can use any URL shortening service API or your own URL shortening service implementation
  // For demonstration, let's use a simple method with shortid
  const shortCode = shortid.generate();
  const shortURL = `${process.env.AGENTREGISTE}?referral=${shortCode}`;
  return shortURL;
}