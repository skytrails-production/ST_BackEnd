const config = require("../config/auth.config");
const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const whatsappAPIUrl = require("../utilities/whatsApi");
const hwaiYatrawhatsappUrl=require("../utilities/b2bWhatsApp")
const approvalStatus = require("../enums/approveStatus");
const storyStatus=require("../enums/storyStatus");
const authType=require("../enums/authType")
//********************MODELS**********************/
const flightModel = require("../model/flightBookingData.model");
const hotelBookingModel = require("../model/hotelBooking.model");
const busBookingModel = require("../model/busBookingData.model");
//***********************************SERVICES********************************************** */
const {notificationServices}=require('../services/notificationServices')
const {createNotification,findNotification,findNotificationData,deleteNotification,updateNotification,countNotification}=notificationServices;

const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification,
  pushNotification1
} = require("../utilities/commonFunForPushNotification");
const adminModel=require("../model/user.model")
const { userServices } = require("../services/userServices");
const userType = require("../enums/userType");
const status = require("../enums/status");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
} = userServices;
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
const {
  advertisementServices,
} = require("../services/btocServices/advertisementServices");
const {
  createadvertisement,
  findadvertisementData,
  deleteadvertisement,
  advertisementList,
  updateadvertisement,
  countTotaladvertisement,
  getAdvertisment,
} = advertisementServices;
const {
  webAdvertisementServices,
} = require("../services/btocServices/webUserOfferServices");
const {
  createWebadvertisement,
  findWebadvertisementData,
  deletWebeadvertisement,
  webAdvertisementList,
  updateWebadvertisement,
  countTotalWebadvertisement,
  getWebAdvertisment,
} = webAdvertisementServices;
const { forumQueServices } = require("../services/forumQueServices");
const {
  createforumQue,
  findforumQue,
  findforumQueData,
  deleteforumQue,
  updateforumQue,
  forumQueListLookUpAdmin,
  forumQueListLookUp,
  forumQueListLookUp1,
  getTopSTories,
  forumQueListLookUpOfUser,
} = forumQueServices;

const { brbuserServices } = require("../services/btobagentServices");
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
const { cancelBookingServices } = require("../services/cancelServices");
const {
  createcancelFlightBookings,
  findAnd,
  findCancelFlightBookings,
  updatecancelFlightBookings,
  findHotelCancelRequest,
  findBusCancelRequest,
  aggregatePaginatecancelFlightBookingsList,
  countTotalcancelFlightBookings,
  findCancelHotelBookings,
  createHotelCancelRequest,
  updateHotelCancelRequest,
  getHotelCancelRequesrByAggregate,
  countTotalHotelCancelled,
  createBusCancelRequest,
  updateBusCancelRequest,
  findCancelBusBookings,
  getBusCancelRequestByAggregate,
  countTotalBusCancelled,
  getBusCancellation,
} = cancelBookingServices;
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
/********************SUbAdmin apis************************************************* */
exports.createSubAdmin = async (req, res, next) => {
  try {
    const { username, email, password, mobile_number, authType,dynamicProperties } = req.body;
    const isAdmin = await adminModel.findOne({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    // if (!isAdmin) {
    //     return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    // }
    const isSubAdminExist = await findSubAdmin({
      email: email,
      userType: "SUBADMIN",
      mobile_number: mobile_number,
    });
    if (isSubAdminExist) {
      return res.status(statusCode.Conflict).send({
        status: statusCode.Conflict,
        message: responseMessage.SUBADMIN_ALREADY_EXIST,
      });
    }
    const pass = await bcrypt.hash(password, 10);
    const data = {
      userName: username,
      email: email,
      password: pass,
      contactNumber: mobile_number,
      authType: authType,
      dynamicProperties:dynamicProperties
    };
    const result = await createSubAdmin(data);
    // const result = {
    //     userName: doc.username,
    //     email: doc.email,
    //     contactNumber: doc.mobile_number,
    //     userType: doc.userType

    // }
    await sendSMS.sendSMSForSubAdmin(mobile_number, result.email);
    const message = `Welcome To TheSkyTrails, now you are subAdmin.`;
    const MobileNo='+91'+mobile_number;
    
    // await whatsappAPIUrl.sendMessageWhatsApp(MobileNo, message,"hello_test");
    const template=[String("SubAdmin"),String(result.userName),String(password),String("https://thehawaiyatra.com/subAdminLogin")]
    await hwaiYatrawhatsappUrl.sendWhtsAppAISensy(MobileNo,template,"loginCredential")
    await commonFunction.sendSubAdmin(result.email, result.userName, password);
    return res.status(statusCode.OK).send({
      status: statusCode.OK,
      message: responseMessage.SUBADMIN_CREATED,
      result: result,
    });
  } catch (error) {
    console.log("error======>>>>.", error);
    return next(error);
  }
};

exports.updateSubAdmin = async (req, res, next) => {
  try {
    const { subAdminId, username, email, mobile_number, profilePic } = req.body;
    const isAdmin = await adminModel.findOne({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    // if (!isAdmin) {
    //   return res
    //     .status(statusCode.Unauthorized)
    //     .send({ message: responseMessage.UNAUTHORIZED });
    // }
    if (email || mobile_number) {
      const isSubAdminAlreadyExist = await findSubAdmin({
        $or: [{ email: email }, { mobile_number: mobile_number }],
        _id: { $nin: subAdminId },
      });
      if (isSubAdminAlreadyExist) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.SUBADMIN_ALREADY_EXIST });
      }
    }
    if (req.file) {
      req.body.profilePic = await commonFunction.getImageUrl(req.file);
    }
    const result = await updateSubAdmin({ _id: subAdminId }, req.body);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.UPDATE_SUCCESS, result: result });
  } catch (error) {
    console.log("error======>>>>.", error);
    return next(error);
  }
};

exports.deleteSubAdmin = async (req, res, next) => {
  try {
    const { adminId,subAdminID } = req.body;
    const isAdmin = await adminModel.findOne({
      _id: adminId,
      userType: userType.ADMIN,
    });
    if (!isAdmin) {
      return res
        .status(statusCode.Unauthorized)
        .send({ message: responseMessage.UNAUTHORIZED });
    }
    const result = await updateSubAdmin(
      { _id: subAdminID },
      { status: status.DELETE }
    );
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DELETE_SUCCESS, result: result });
  } catch (error) {
    console.log("error======>>>>.", error);
    return next(error);
  }
};

exports.getSubAdmin = async (req, res, next) => {
  try {
    // const isAdmin = await findUser({ _id: req.userId, userType: [userType.ADMIN] });
    // if (!isAdmin) {
    //     return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    // }
    const result = await findSubAdminData({ userType: userType.SUBADMIN });
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error======>>>>.", error);
    return next(error);
  }
};

exports.subAdminLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const isSubAdminExist = await findSubAdmin({
      $and: [
        {
          $or: [
            { userName: userName },
            { email: userName },
            { contactNumber: userName },
          ],
        },
        { userType: userType.SUBADMIN },
        { status: status.ACTIVE },
      ],
    });
    if (!isSubAdminExist) {
      return res
        .status(statusCode.OK)
        .send({ statusCode:statusCode.NotFound,message: responseMessage.USERS_NOT_FOUND });
    }
    const isMatched = bcrypt.compareSync(password, isSubAdminExist.password);
    if (!isMatched) {
      return res
        .status(statusCode.OK)
        .send({ statusCode:statusCode.badRequest,message: responseMessage.INCORRECT_LOGIN });
    }
    const token = await commonFunction.getToken({
      id: isSubAdminExist._id,
      email: isSubAdminExist.email,
      userName: isSubAdminExist.userName,
      userType: isSubAdminExist.userType,
      authType: isSubAdminExist.authType,
    });
    const data = {
      userName: isSubAdminExist.userName,
      email: isSubAdminExist.email,
      contactNumber: isSubAdminExist.contactNumber,
      status: isSubAdminExist.status,
      userType: isSubAdminExist.userType,
      authType: isSubAdminExist.authType,
    };
    const result = {
      token,
      data,
    };
    return res
      .status(statusCode.OK)
      .send({ statusCode:statusCode.OK,message: responseMessage.LOGIN, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};

exports.forgetPassword=async(req,res,next)=>{
  try {
    const {email}=req.body;
    const isEmailExist=await findSubAdmin({email:email});
    if(!isEmailExist){
      return res.status(statusCode.OK).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.EMAIL_NOT_EXIST 
      });
    }
    const token=await commonFunction.getResetToken({
      id:isEmailExist._id,
      email:isEmailExist.email,
      contactNumber:isEmailExist.contactNumber,
      userType:isEmailExist.userType
    })
    // const link=`localhost:8000/skytrails/api/subAdmin/resetPassword/${isEmailExist._id}`
// await commonFunction.sendEmailResetPassword(email,link);
    await commonFunction.sendEmailResetPassword(email,token)
return res.status(statusCode.OK).send({ 
  statusCode: statusCode.OK, 
  responseMessage: responseMessage.RESET_LINK_SEND ,
  result:token
});
  } catch (error) {
    console.log("Error while trying to send forot mail",error);
    return next(error);
  }
}
exports.passwordReset=async(req,res,next)=>{
  try {
    const {password,confirmpassword}=req.body;
    const isEmailExist=await findSubAdmin({_id:req.userId});
    if(!isEmailExist){
      return res.status(statusCode.OK).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.EMAIL_NOT_EXIST 
      });
    }
    if(password!==confirmpassword){
      return res.status(statusCode.OK).send({ 
        statusCode: statusCode.badRequest, 
        responseMessage: responseMessage.PASSWORD_NOT_MATCH 
      });
    }
    const hashPass=await bcrypt.hashSync(password,10);
    await updateSubAdmin({_id:isEmailExist._id},{password:hashPass});
    return res.status(statusCode.OK).send({ 
      statusCode: statusCode.OK, 
      responseMessage: responseMessage.UPDATE_SUCCESS 
    });
  } catch (error) {
    console.log("Error while trying to reset password",error);
    return next(error);
  }
}

exports.getSubAdminByAggregate = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await paginateSubAdminSearch(req.query);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error======>>>>.", error);
    return next(error);
  }
};

exports.subAdminDashboard = async (req, res, next) => {
  try {
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.ADMIN_NOT_FOUND,
        });
    }
    const result = {};
    result.webAdd = await countTotalWebadvertisement({});
    result.AppAdd = await countTotaladvertisement({});
    result.reqwebAdd = await countTotalWebadvertisement({
      approvalStatus: approvalStatus.PENDING,
    });
    result.reqAppAdd = await countTotaladvertisement({
      approvalStatus: approvalStatus.PENDING,
    });
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    console.log("error on dashboard", error);
    return next(error);
  }
};

exports.updateTaskOfSubAdmin=async(req,res,next)=>{
  try {
    const {agentId,subAdminID,dynamicProperties,authType}=req.body;
    const isAdminExist=await adminModel.findOne({_id:agentId,userType:userType.ADMIN,status:status.ACTIVE});
    if (!isAdminExist) {
      return res
        .status(statusCode.Unauthorized)
        .send({ responseMessage: responseMessage.UNAUTHORIZED });
    }
    const isSubAdminExist =await findSubAdmin({_id:subAdminID,status:status.ACTIVE});
    if(!isSubAdminExist){
      return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.SUBADMIN_NOT_EXIST})
    }
    const object={
      dynamicProperties:dynamicProperties,
      authType:authType
    }
    const updatedSubAdmin=await updateSubAdmin({_id:isSubAdminExist._id},object);
    return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.UPDATE_SUCCESS,result:updatedSubAdmin});
    
  } catch (error) {
    console.log("error while update task",error);
    return next(error)
  }
} 

exports.deletePost=async(req,res,next)=>{
  try {
    const isPostExist=await findforumQue({_id:req.params.id});
    if(!isPostExist){
      return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.POST_NOT_FOUND});
    }
    const result=await deleteforumQue({_id:req.params.id});
    if(result){
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DELETE_SUCCESS,result:result});
    } 
  } catch (error) {
    console.error("error while delete post of user========",error);
    return next(error)
  }
}

exports.approveStory=async(req,res,next)=>{
  try {
    const isPostExist=await findforumQue({_id:req.body.storyId});
    if(!isPostExist){
      return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.POST_NOT_FOUND});
    }
    const result=await updateforumQue({_id:isPostExist._id},{status:storyStatus.ACTIVE});
   
    const findUser=await findUserData({_id:isPostExist.userId});
   const notificationData= await findNotification({notificationType:'postapprove'});
    const sentNotification=await pushNotification(findUser.deviceToken,notificationData.title, notificationData.description);
    if(result){
      return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.UPDATE_SUCCESS,result:result});
    }   
  } catch (error) {
    console.log("error while approve story",error);
    return next(error)
  }
}
exports.getPost = async (req, res, next) => {
  try {
    const result = {}; // Declare as an object
    const { search, page, limit, questionId, userId } = req.query;
    const post = await forumQueListLookUpAdmin({});
    if (post) {
      result.post = post;
    } else {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    // console.log("lenghth", post.length);
    const unanswered = await forumQueListLookUp(req.query);
    if (unanswered) {
      result.unanswered = unanswered;
    } else {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    if (result.unanswered) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
    } else {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
  } catch (error) {
    console.log("error========>>>>>>", error);
    return next(error);
  }
};

exports.addTrending=async(req,res,next)=>{
  try {
    const isPostExist=await findforumQue({_id:req.body.storyId});
    if(!isPostExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.POST_NOT_FOUND,
      });
    }
    const result=await updateforumQue({_id:req.body.storyId},{trending:true});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.ADDED_ON_TREND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to make it trending.",error);
    return next(error)
  }
}

exports.getAgentsIdName=async(req,res,next)=>{
  try {
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    let agentIdArray = [];
    const agentsArray = await findbrbData({is_active:1});
    for (let agent of agentsArray) {
      const obj = {
        agentId: agent._id,
        agentName:
          agent.personal_details.first_name + agent.personal_details.last_name,
      };
      agentIdArray.push(obj);
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: agentIdArray,
    });
  } catch (error) {
    console.log("Error while trying to get subadmin agent Bookings", error);
    return next(error);
  }
}

exports.getBookingAgentWise=async(req,res,next)=>{
  try {
    let { agentId, bookingType } = req.body;
    if (req.body.bookingType) {
      req.body.bookingType = req.body.bookingType.toLowerCase();
    }
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    let result = {};
    const isAgentExist = await findOneAgent({ _id: agentId });
    if (!isAgentExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    if (req.body.bookingType === "flight") {
      result.flightBooking = await flightModel.find({
        userId: isAgentExist._id,
      });
    } else if (req.body.bookingType === "bus") {
      result.busBooking = await busBookingModel.find({
        userId: isAgentExist._id,
      });
    }
    if (req.body.bookingType === "hotel") {
      result.hotelBooking = await hotelBookingModel.find({
        userId: isAgentExist._id,
      });
    } else if (req.body.bookingType === "all") {
      result.flightBooking = await flightModel.find({
        userId: isAgentExist._id,
      });
      result.busBooking = await busBookingModel.find({
        userId: isAgentExist._id,
      });
      result.hotelBooking = await hotelBookingModel.find({
        userId: isAgentExist._id,
      });
    }
    if (!result||result==null) {
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
    console.log("Error while trying to get subadmin agent Bookings", error);
    return next(error);
  }
}

exports.getAgentCancelRequest = async (req, res, next) => {
  try {
    const { agentId, searchType } = req.body;
    if (req.body.searchType) {
      req.body.searchType = req.body.searchType.toLowerCase();
    }
    let result = {};
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    const isAgentExist = await findOneAgent({ _id: agentId });
    if (!isAgentExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    if (req.body.searchType === "flight" || req.body.searchType === "all") {
      result.flightCancelReq = await findAnd({ userId: isAgentExist._id });
    }
    if (req.body.searchType === "bus" || req.body.searchType === "all") {
      result.busCancelReq = await findBusCancelRequest({
        userId: isAgentExist._id,
      });
    }
    if (req.body.searchType === "hotel" || req.body.searchType === "all") {
      result.hotelCancelReq = await findHotelCancelRequest({
        userId: isAgentExist._id,
      });
    }
    const resultKeys = Object.keys(result);
    let totalCount = 0;
    for (const key of resultKeys) {
      totalCount += result[key].length;
    }
    result.totalCount = totalCount;
    if (totalCount < 1) {
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
    console.log("Error while trying to get agentCancelRequest", error);
    return next(error);
  }
};

exports.getAgentChangeRequest = async (req, res, next) => {
  try {
    const { agentId, searchType } = req.body;
    if (req.body.searchType) {
      req.body.searchType = req.body.searchType.toLowerCase();
    }
    let result = {};
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    const isAgentExist = await findOneAgent({ _id: agentId });
    if (!isAgentExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    if (req.body.searchType === "flight" || req.body.searchType === "all") {
      result.flightCancelReq = await findchangeRequestData({
        agentId: isAgentExist._id,
      });
    }
    if (req.body.searchType === "bus" || req.body.searchType === "all") {
      result.busCancelReq = await findchangeBusRequestData({
        agentId: isAgentExist._id,
      });
    }
    if (req.body.searchType === "hotel" || req.body.searchType === "all") {
      result.hotelCancelReq = await findchangeHotelRequestData({
        agentId: isAgentExist._id,
      });
    }
    const resultKeys = Object.keys(result);
    let totalCount = 0;
    for (const key of resultKeys) {
      totalCount += result[key].length;
    }
    result.totalCount = totalCount;
    if (totalCount < 1) {
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
    console.log("Error while trying to get agentCancelRequest", error);
    return next(error);
  }
};

exports.findRMAgentList=async(req,res,next)=>{
  try {
    const {rmId}=req.query;
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    const isRMExist=await findRelationShipManager({_id:rmId,status:status.ACTIVE});
    const result = await findbrbData({
      "personal_details.address_details.city": isRMExist.addressDetails.city,
    });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to get rmagents", error);
    return next(error);
  }
}

exports.getAgnetReferralsCount=async(req,res,next)=>{
  try {
    const {agentId}=req.query;
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
      authType:authType.BOOKING_MANAGER
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    const isAgentExist=await findbrbuser({_id:agentId});
    if(!isAgentExist){
      return res
      .status(statusCode.NotFound)
      .send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const isReferralExist=await countTotalbrbUser({referrerCode:isAgentExist.referralCode});
     return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: isReferralExist,
    });
  } catch (error) {
    console.log("Error while trying to get count of referrals", error);
    return next(error);
  }
}

exports.getSubAdminDashboard=async(req,res,next)=>{
  try {
    const isSubAdmin = await findSubAdminData({
      _id: req.userId,
      userType: userType.SUBADMIN,
      authType:authType.BOOKING_MANAGER
    });
    // console.log("isSubAdmin==========", isSubAdmin);
    if (!isSubAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
  } catch (error) {
    console.log("error while trying to get booking of booking manager",error);
    return next(error);
  }
}




