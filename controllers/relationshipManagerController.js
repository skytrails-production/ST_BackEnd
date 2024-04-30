var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const whatsappAPIUrl = require("../utilities/whatsApi");
const userType = require("../enums/userType");
// const authType=require("../enums/authType")
const status = require("../enums/status");
const Moment = require("moment");
//********************MODELS**********************/
const flightModel = require("../model/flightBookingData.model");
const hotelBookingModel = require("../model/hotelBooking.model");
const busBookingModel = require("../model/busBookingData.model");
//************SERVICES*************** */
const { userServices } = require("../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  deleteUser,
  userList,
  updateUser,
  countTotalUser,
  aggregatePaginateUser,
  aggregatePaginateUserList,
} = userServices;
const {
  relationShipManagerServices,
} = require("../services/relationshipManagerServices");
const {
  createRelationShipManager,
  findRelationShipManager,
  findRelationShipManagerData,
  deleteRelationShipManager,
  relationShipManagerList,
  updateRelationShipManager,
  paginateRelationShipManagerSearch,
  countTotalRelationShipManager,
} = relationShipManagerServices;
const { subAdminServices } = require("../services/subAdminServices");
const {
  createSubAdmin,
  findSubAdmin,
  findSubAdminData,
  deleteSubAdmin,
  subAdminList,
  updateSubAdmin,
  paginateSubAdminSearch,
  countTotalSubAdmin,
} = subAdminServices;
const { brbuserServices } = require("../services/btobagentServices");
const { ucs2 } = require("punycode");
const { Status } = require("whatsapp-web.js");
const { credential } = require("firebase-admin");
const {
  createbrbuser,
  findbrbuser,
  findOneAgent,
  getbrbuser,
  findbrbuserData,
  findbrbData,
  deletebrbuser,
  brbuserList,
  updatebrbuser,
  paginatebrbuserSearch,
  countTotalbrbUser,
} = brbuserServices;
/**********************************SERVICES********************************** */
const { cancelBookingServices } = require("../services/cancelServices");
const { createcancelFlightBookings,findAnd, findCancelFlightBookings,updatecancelFlightBookings,findHotelCancelRequest,findBusCancelRequest, aggregatePaginatecancelFlightBookingsList, countTotalcancelFlightBookings,findCancelHotelBookings, createHotelCancelRequest, updateHotelCancelRequest, getHotelCancelRequesrByAggregate, countTotalHotelCancelled, createBusCancelRequest, updateBusCancelRequest, findCancelBusBookings,getBusCancelRequestByAggregate, countTotalBusCancelled,getBusCancellation } = cancelBookingServices;
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
  findchangeHotelRequestData,
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
  findchangeBusRequestData,
  getchangeBusRequest,
  deletechangeBusRequest,
  changeBusRequestList,
  updatechangeBusRequest,
  paginatechangeBusRequestSearch,
  aggregatePaginatechangeBusRequestList,
  countTotalchangeBusRequest,
} = changeBusRequestServices;

//************************************************API************************************************

exports.createRelationShipManage = async (req, res, next) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      profilePic,
      contactNumber,
      password,
      city,
      pincode,
      state,
      country,
    } = req.body;
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    if (!isSubAdmin) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.ADMIN_NOT_FOUND,
      });
    }
    const pass = await bcrypt.hashSync(password, 10);
    const object = {
      reportingManager: isSubAdmin._id,
      userName,
      firstName,
      lastName,
      email,
      profilePic,
      contactNumber,
      password: pass,
      addressDetails: { city, pincode, state, country },
    };
    const isUserExist = await findRelationShipManager({
      status: { $ne: status.DELETE },
      $or: [{ email: email }, { contactNumber: contactNumber }],
    });
    if (isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.USER_ALREADY_EXIST,
      });
    }
    const result = await createRelationShipManager(object);
    console.log("result=====", result);
    const sent = await whatsappAPIUrl.sendWhatsAppMsgRM(
      "+91" + contactNumber,
      firstName + lastName,
      userName,
      password,
      "rmlogin"
    );
    console.log("sent=====", sent);

    await commonFunction.sendRMCredential(email, email, password);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while craete rm manager", error);
    return next(error);
  }
};

exports.getRelationShipManagers = async (req, res, next) => {
  try {
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    //   authType:[authType.BOOKING_MANAGER,authType.AGENT_MANAGER]
    });
    if (!isSubAdmin) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.ADMIN_NOT_FOUND,
      });
    }
    const result = await relationShipManagerList({
      reportingManager: isSubAdmin._id,
      status: status.ACTIVE,
    });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to get RM", error);
    return next(error);
  }
};

exports.getRelationShipManagerById = async (req, res, next) => {
  try {
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.ADMIN_NOT_FOUND,
      });
    }
    const result = await findRelationShipManagerData({
      reportingManager: isSubAdmin._id,
      status: status.ACTIVE,
    });
    if (!result.length) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to get RM", error);
    return next(error);
  }
};

exports.loginRM = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let isRMExist = await findRelationShipManager({
      $or: [{ userName: email }, { email: email }, { contactNumber: email }],
      status: { $ne: status.DELETE },
    });
    if (!isRMExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
      });
    }
    if (!bcrypt.compareSync(password, isRMExist.password)) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.INCORRECT_LOGIN,
      });
    }
    const token = await commonFunction.getToken({
      _id: isRMExist._id,
      phone: isRMExist.contactNumber,
      city: isRMExist.addressDetails.city,
      email: isRMExist.email,
    });
    // Include the token in the result object
    const resultWithToken = { ...isRMExist.toObject(), token };

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.RM_LOGIN_SUCCESS,
      result: resultWithToken, // Send the result with token included
    });
  } catch (error) {
    console.log("Error while trying to sign in RM", error);
    return next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUserExist = await findUser({
      status: { $ne: status.DELETE },
      $or: [{ email: email, contactNumber: email }],
    });
    if (isUserExist) {
    }
  } catch (error) {
    console.log("Error while trying to reset password", error);
    return next(error);
  }
};
// exports.getAllRMOfAGENT = async (req, res, next) => {
//   try {
//     const isAgentExist = await findOneAgent({});
//   } catch (error) {
//     console.log("error while trying to get all agent as per city");
//     return next(error);
//   }
// };

exports.getAgentListOfRM = async (req, res, next) => {
  try {
    const isRMExist = await findRelationShipManager({
     _id:req.userId,
    });
    if (!isRMExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
      });
    }
    const result = await findbrbData({ 'personal_details.address_details.city': isRMExist.addressDetails.city });
    return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result:result
      });
  } catch (error) {
    console.log("Error while trying to get agent of RM", error);
    return next(error);
  }
};


exports.getAgentList=async(req,res,next)=>{
    try {
        // const {agentId}=req.query;
        const isRMExist = await findRelationShipManager({
            _id:req.userId,
           });
           if (!isRMExist) {
             return res.status(statusCode.OK).send({
               statusCode: statusCode.NotFound,
               responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
             });
           }
           let agentIdArray=[];
           const agentsArray = await findbrbData({$or:[{ 'personal_details.address_details.city': isRMExist.addressDetails.city },{'personal_details.address_details.state': isRMExist.addressDetails.state}]});
           for(let agent of agentsArray){
            const obj={
                agentId:agent._id,
                agentName: agent.personal_details.first_name+agent.personal_details.last_name
            }
            agentIdArray.push(obj);
           }
           return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:agentIdArray
          });
    } catch (error) {
        console.log("Error while trying to get RM agent Bookings",error);
        return next(error)
    }
}

exports.getAgentBooking=async(req,res,next)=>{
    try {
        let {agentId,bookingType}=req.body;
        if(req.body.bookingType){
            req.body.bookingType=req.body.bookingType.toLowerCase();
        }
        const isRMExist = await findRelationShipManager({
            _id:req.userId,
           });
           if (!isRMExist) {
             return res.status(statusCode.OK).send({
               statusCode: statusCode.NotFound,
               responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
             });
           }
        let result = {};
        const isAgentExist=await findOneAgent({_id:agentId});
        if(!isAgentExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.AGENT_NOT_FOUND,
              });
        }
        if(req.body.bookingType==="flight"){
            console.log("=====================",bookingType);
            result.flightBooking=await flightModel.find({userId:isAgentExist._id});
        }else if(req.body.bookingType==="bus"){
            console.log("=====================",req.body.bookingType);
            result.busBooking=await busBookingModel.find({userId:isAgentExist._id});
        } if(req.body.bookingType==="hotel"){
            console.log("=====================",req.body.bookingType);
            result.hotelBooking=await hotelBookingModel.find({userId:isAgentExist._id});
        }else if(req.body.bookingType==="all"){
            console.log("req.body.bookingType============",req.body.bookingType);
            result.flightBooking=await flightModel.find({userId:isAgentExist._id});
            result.busBooking=await busBookingModel.find({userId:isAgentExist._id});
            result.hotelBooking=await hotelBookingModel.find({userId:isAgentExist._id});
        }
        if(result.length<1){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
              });
        }

        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result:result
          });
    } catch (error) {
        console.log("error while trying to get booking of agnet who assosisate with rm",error);
        return next(error);
    }
}

exports.getAgentCancelRequest=async(req,res,next)=>{
    try {
        const {agentId,searchType}=req.body;
if(req.body.searchType){
    req.body.searchType=req.body.searchType.toLowerCase();
}
let result = {};
        const isRMExist = await findRelationShipManager({
            _id:req.userId,
           });
           if (!isRMExist) {
             return res.status(statusCode.OK).send({
               statusCode: statusCode.NotFound,
               responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
             });
           }
           const isAgentExist=await findOneAgent({_id:agentId});
           if(!isAgentExist){
               return res.status(statusCode.OK).send({
                   statusCode: statusCode.NotFound,
                   responseMessage: responseMessage.AGENT_NOT_FOUND,
                 });
           }
           if (req.body.searchType === "flight" || req.body.searchType === "all") {
            result.flightCancelReq = await findAnd({ userId: isAgentExist._id });
        }
        if (req.body.searchType === "bus" || req.body.searchType === "all") {
            result.busCancelReq = await findBusCancelRequest({ userId: isAgentExist._id });
        }
        if (req.body.searchType === "hotel" || req.body.searchType === "all") {
            result.hotelCancelReq = await findHotelCancelRequest({ userId: isAgentExist._id });
        }
        const resultKeys = Object.keys(result);
        let totalCount = 0;
        for (const key of resultKeys) {
            totalCount += result[key].length;
        }
        result.totalCount = totalCount;
        console.log("result============",result)
        if (totalCount < 1) {
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.DATA_NOT_FOUND,
            });
        }
        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result: result
        });
    } catch (error) {
        console.log("Error while trying to get agentCancelRequest",error);
        return next(error);
    }
}

exports.getAgentChangeRequest=async(req,res,next)=>{
  try {
      const {agentId,searchType}=req.body;
if(req.body.searchType){
  req.body.searchType=req.body.searchType.toLowerCase();
}
let result = {};
      const isRMExist = await findRelationShipManager({
          _id:req.userId,
         });
         if (!isRMExist) {
           return res.status(statusCode.OK).send({
             statusCode: statusCode.NotFound,
             responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
           });
         }
         const isAgentExist=await findOneAgent({_id:agentId});
         if(!isAgentExist){
             return res.status(statusCode.OK).send({
                 statusCode: statusCode.NotFound,
                 responseMessage: responseMessage.AGENT_NOT_FOUND,
               });
         }
         if (req.body.searchType === "flight" || req.body.searchType === "all") {
          result.flightCancelReq = await findchangeRequestData({ agentId: isAgentExist._id });
      }
      if (req.body.searchType === "bus" || req.body.searchType === "all") {
          result.busCancelReq = await findchangeBusRequestData({ agentId: isAgentExist._id });
      }
      if (req.body.searchType === "hotel" || req.body.searchType === "all") {
          result.hotelCancelReq = await findchangeHotelRequestData({ agentId: isAgentExist._id });
      }
      const resultKeys = Object.keys(result);
      let totalCount = 0;
      for (const key of resultKeys) {
          totalCount += result[key].length;
      }
      result.totalCount = totalCount;
      console.log("result============",result)
      if (totalCount < 1) {
          return res.status(statusCode.OK).send({
              statusCode: statusCode.NotFound,
              responseMessage: responseMessage.DATA_NOT_FOUND,
          });
      }
      return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.DATA_FOUND,
          result: result
      });
  } catch (error) {
      console.log("Error while trying to get agentCancelRequest",error);
      return next(error);
  }
}

