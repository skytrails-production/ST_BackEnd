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
const approvalStatus = require("../enums/approveStatus");
//***********************************SERVICES********************************************** */
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
    const MobileNo='+91'+mobile_number
    await whatsappAPIUrl.sendMessageWhatsApp(MobileNo, message,'hello_test');
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
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USERS_NOT_FOUND });
    }
    const isMatched = bcrypt.compareSync(password, isSubAdminExist.password);
    if (!isMatched) {
      return res
        .status(statusCode.badRequest)
        .send({ message: responseMessage.INCORRECT_LOGIN });
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
    };
    const result = {
      token,
      data,
    };
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.LOGIN, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};

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
    // console.log("================================")
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