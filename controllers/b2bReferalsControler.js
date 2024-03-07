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


exports.getReferalBookings=async(req,res,next)=>{
  try {
    const finalResult=[];
    const result={}
    const isAgentExist=await findOne({_id: req.params.userId});
    if (!isAgentExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const allReferrals=await findbrbData({referrerCode:isAgentExist.referralCode});
    for(const againts of allReferrals){
      const flightBooking=await flightModel.find({userId:againts._id});
      console.log(againts._id,"flightBooking.length=============",flightBooking.length);
      result.userId=againts._id;
      result.flighBookings=flightBooking.length;
      result.flighBookingRevenue=flightBooking.length;
      const hotelBooking=await hotelBookingModel.find({userId:againts._id});
      console.log("hotelBooking.length==============",hotelBooking.length);
      result.hotelBookings=hotelBooking.length;
      const busBooking=await busBookingModel.find({userId:againts._id});
      console.log("busBooking.length================",busBooking.length);
      result.busBookings=busBooking.length;
      finalResult.push(result);
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SUCCESS,
      result:finalResult
    });
  } catch (error) {
    console.log("error while trying to get ==========",);
    return next(error);
  }
}
async function shortenURL(url) {
  // Here, you can use any URL shortening service API or your own URL shortening service implementation
  // For demonstration, let's use a simple method with shortid
  const shortCode = shortid.generate();
  const shortURL = `${process.env.AGENTREGISTE}?referral=${shortCode}`;
  return shortURL;
}