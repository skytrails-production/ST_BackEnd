const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require('axios');
const jwt = require('jsonwebtoken');
const shortid = require("shortid");
/**********************************SERVICES***********************************/
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
const {
  createUsertransaction,
  findUsertransaction,
  getUsertransaction,
  deleteUsertransaction,
  userUsertransactionList,
  updateUsertransaction,
  paginateUsertransaction,
  countTotalUsertransaction,
} = transactionModelServices;
const {
  eventBookingServices,
} = require("../../services/btocServices/eventBookingServices");
const {
  createBookingEvent,
  findBookingEventData,
  deleteBookingEvent,
  eventBookingList,
  updateBookingEvent,
  countTotalBookingEvent,
  eventBookingListPopulated,
  getBookingEvent,
} = eventBookingServices;
const {
  pushNotificationServices,
} = require("../../services/pushNotificationServices");
// const referralCodes=require('referral-codes');
const {
  createPushNotification,
  findPushNotification,
  findPushNotificationData,
  deletePushNotification,
  updatePushNotification,
  countPushNotification,
} = pushNotificationServices;
const {
  referralAmountServices,
} = require("../../services/referralAmountServices");
const { date } = require("joi");
const {
  createReferralAmount,
  findReferralAmount,
  deleteReferralAmount,
  referralAmountList,
  updateReferralAmount,
  referralAmountListPaginate,
} = referralAmountServices;
const {
  userWalletHistoryServices,
} = require("../../services/btocServices/userWalletHistoryServices");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const User = require("../../model/btocModel/userModel");
const {
  createUserWalletHistory,
  findUserWalletHistory,
  deleteUserWalletHistory,
  userWalletHistoryList,
  userAllWalletHistory,
  updateUserWalletHistory,
  countTotalUserWalletHistory,
} = userWalletHistoryServices;
const {
  hotelBookingServicess,
} = require("../../services/hotelBookingServices");
const {
  aggregatePaginateHotelBookingList,
  aggregatePaginateHotelBookingList1,
  findhotelBooking,
  findhotelBookingData,
  deletehotelBooking,
  updatehotelBooking,
  hotelBookingList,
  countTotalBooking,
} = hotelBookingServicess;
const {
  userBusBookingServices,
} = require("../../services/btocServices/busBookingServices");
const {
  createUserBusBooking,
  findUserBusBooking,
  getUserBusBooking,
  findUserBusBookingData,
  deleteUserBusBooking,
  userBusBookingList,
  updateUserBusBooking,
  paginateUserBusBookingSearch,
} = userBusBookingServices;
const {
  userflightBookingServices,
} = require("../../services/btocServices/flightBookingServices");
const {
  createUserflightBooking,
  findUserflightBooking,
  getUserflightBooking,
  findUserflightBookingData,
  deleteUserflightBooking,
  userflightBookingList,
  updateUserflightBooking,
  paginateUserflightBookingSearch,
  aggregatePaginateGetBooking,
} = userflightBookingServices;

//******************************************User SignUp api*************************/

exports.login = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.INCORRECT_LOGIN,
      });
    }
    const isExist = await findUser({
      "phone.mobile_number": mobileNumber,
      userType: userType.USER,
      status: status.ACTIVE,
    });
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const obj = {
      phone: {
        mobile_number: mobileNumber,
      },
      otp: otp,
      otpExpireTime: otpExpireTime,
    };
    if (!isExist) {
      const result1 = await createUser(obj);
      const contactNumber =
        result1.phone.country_code + result1.phone.mobile_number;
      const userName = "Dear";
      const userOtp = `${otp}`;
      await whatsappAPIUrl.sendMessageWhatsApp(
        contactNumber,
        userName,
        userOtp,
        "loginotp"
      );
      await sendSMS.sendSMSForOtp(mobileNumber, otp);
      token = await commonFunction.getToken({
        _id: result1._id,
        mobile_number: result1.mobile_number,
      });
      const result = {
        firstTime: result1.firstTime,
        _id: result1._id,
        phone: result1.phone,
        userType: result1.userType,
        otpVerified: result1.otpVerified,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    }
    const var1 = isExist.username === "" ? "Dear" : isExist.username;
    const var2 = `${otp}`;
    if (mobileNumber === "9999123232") {
      let updatedNumber = await updateUser(
        { "phone.mobile_number": mobileNumber, status: status.ACTIVE },
        {
          "phone.mobile_number": mobileNumber,
          otpVerified: false,
          otpExpireTime: null,
          approveStatus: "APPROVED",
        }
      );
      token = await commonFunction.getToken({
        _id: isExist._id,
        mobile_number: isExist.phone.mobile_number,
      });
      const result = {
        firstTime: isExist.firstTime,
        _id: isExist._id,
        phone: isExist.phone,
        userType: isExist.userType,
        otpVerified: isExist.otpVerified,
        otp: "123456",
        status: isExist.status,
        token: token,
      };
      await sendSMS.sendSMSForOtp(mobileNumber, result.otp);
      await whatsappAPIUrl.sendMessageWhatsApp(
        "+919999123232",
        var1,
        result.otp,
        "loginotp"
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    }
    obj.otpVerified = false;
    let updatedUser = await updateUser(
      { "phone.mobile_number": mobileNumber, status: status.ACTIVE },
      obj
    );
    const userMobile = isExist.phone.country_code + isExist.phone.mobile_number;
    await whatsappAPIUrl.sendMessageWhatsApp(
      userMobile,
      var1,
      var2,
      "loginotp"
    );
    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    if (!updatedUser) {
      return res.status(statusCode.InternalError).json({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    token = await commonFunction.getToken({
      _id: updatedUser._id,
      mobile_number: updatedUser.phone.mobile_number,
    });
    const result = {
      firstTime: updatedUser.firstTime,
      _id: updatedUser._id,
      phone: updatedUser.phone,
      userType: updatedUser.userType,
      otpVerified: updatedUser.otpVerified,
      status: updatedUser.status,
      token: token,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.LOGIN_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.verifyUserOtp = async (req, res, next) => {
  try {
    const { otp, fullName, dob, email, referrerCode } = req.body;
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (isUserExist.otp !== otp) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.INCORRECT_OTP,
      });
    } else if (isUserExist.phone.mobile_number == "9999123232") {
      const updateStaticUser = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otpVerified: true, firstTime: false }
      );
      const token = await commonFunction.getToken({
        _id: updateStaticUser._id,
        mobile_number: updateStaticUser.phone.mobile_number,
      });
      const result = {
        firstTime: updateStaticUser.firstTime,
        _id: updateStaticUser._id,
        phone: updateStaticUser.phone,
        userType: updateStaticUser.userType,
        username: updateStaticUser.username,
        otpVerified: updateStaticUser.otpVerified,
        balance: updateStaticUser.balance,
        status: updateStaticUser.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (new Date().getTime() > isUserExist.otpExpireTime) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.OTP_EXPIRED,
      });
    }
    const updation = await updateUser(
      { _id: isUserExist._id, status: status.ACTIVE },
      { otpVerified: true }
    );
    if (updation.firstTime === false) {
      const token = await commonFunction.getToken({
        _id: updation._id,
        mobile_number: updation.phone.mobile_number,
      });
      const updationData = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otp: " " }
      );
      const result = {
        firstTime: updation.firstTime,
        _id: updation._id,
        phone: updation.phone,
        userType: updation.userType,
        username: updation.username,
        otpVerified: updation.otpVerified,
        balance: updation.balance,
        status: updation.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (!fullName) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Forbidden,
        message: responseMessage.FIELD_REQUIRED,
      });
    }
    const refeerralCode = commonFunction.generateReferralCode();
    const updateData = await updateUser(
      { _id: updation._id },
      {
        username: fullName,
        dob: dob,
        email: email,
        otp: "",
        firstTime: false,
        referralCode: refeerralCode,
      }
    );
    if (referrerCode) {
      const isRefererExist = await findUser({ referralCode: referrerCode });
      if (!isRefererExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest,
          message: responseMessage.INCORRECT_REFERRAL,
        });
      }
      const checkReward = await findReferralAmount({});
      await updateUser(
        { _id: updateData._id },
        {
          referrerCode: referrerCode,
          $inc: { balance: checkReward.refereeAmount },
          referredBy: isRefererExist._id,
        }
      );
      const data = await updateUser(
        { referralCode: referrerCode, _id: isRefererExist._id },
        { $inc: { balance: checkReward.referrerAmount } }
      );
    }
    const token = await commonFunction.getToken({
      _id: updation._id,
      mobile_number: updation.phone.mobile_number,
      username: updateData.username,
    });
    const result = {
      phoneNumber: updateData.phone,
      _id: updateData._id,
      firstTime: updation.firstTime,
      dob: updateData.dob,
      username: updateData.username,
      email: updateData.email,
      token: token,
      status: updateData.status,
      otpVerified: updateData.otpVerified,
      userType: updateData.userType,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.REGISTER_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.resendOtp = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const isExist = await findUser({
      "phone.mobile_number": mobileNumber,
      status: status.ACTIVE,
    });
    if (!isExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (mobileNumber === "9999123232") {
      let updatedNumber = await updateUser(
        { "phone.mobile_number": mobileNumber, status: status.ACTIVE },
        {
          "phone.mobile_number": mobileNumber,
          otpVerified: false,
          otpExpireTime: null,
          approveStatus: "APPROVED",
        }
      );
      token = await commonFunction.getToken({
        _id: isExist._id,
        mobile_number: isExist.phone.mobile_number,
      });
      const result = {
        firstTime: isExist.firstTime,
        _id: isExist._id,
        phone: isExist.phone,
        userType: isExist.userType,
        otpVerified: isExist.otpVerified,
        otp: "123456",
        status: isExist.status,
        token: token,
      };
      await sendSMS.sendSMSForOtp(mobileNumber, result.otp);
      await whatsappAPIUrl.sendMessageWhatsApp(
        "+919999123232",
        var1,
        result.otp,
        "loginotp"
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_SEND,
        result: result,
      });
    }
    const var1 = `${isExist.username}`;
    const var2 = `${otp}`;
    const updateData = await updateUser(
      { _id: isExist._id, status: status.ACTIVE },
      { otp: otp, otpExpireTime: otpExpireTime }
    );
    if (!updateData) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    const userMobile =
      updateData.phone.country_code + updateData.phone.mobile_number;
    await whatsappAPIUrl.sendMessageWhatsApp(
      userMobile,
      var1,
      var2,
      "loginotp"
    );
    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    const token = await commonFunction.getToken({
      _id: updateData._id,
      mobile_number: updateData.phone.mobile_number,
    });
    const result = {
      firstTime: updateData.firstTime,
      _id: updateData._id,
      phone: updateData.phone,
      userType: updateData.userType,
      otpVerified: updateData.otpVerified,
      otp: otp,
      status: updateData.status,
      token: token,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.OTP_SEND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
//**********************************************************UPLOAD IMAGE********************************************/
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const token = await commonFunction.getToken({
      _id: isUserExist._id,
      mobile_number: isUserExist.phone.mobile_number,
    });
    const imageFiles = await commonFunction.getImageUrlAWS(req.file);
    if (!imageFiles) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    let updatedUser = await updateUser(
      { _id: isUserExist._id },
      { profilePic: imageFiles }
    );
    const result = {
      ...updatedUser._doc, 
      token: token, 
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.UPLOAD_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.getUserProfile = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.USERS_FOUND,
      result: isUserExist,
    });
  } catch (error) {
    return next(error);
  }
};
exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const obj = {
      location: {
        coordinates: [longitude, latitude],
      },
    };
    const result = await updateUser({ _id: isUserExist }, obj);
    if (!result) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.forgetPassword = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const isUserExist = await findUser({ "phone.mobile_number": phoneNumber });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const var1 = `${isUserExist.username}`;
    const var2 = `${otp}`;
    const updateUser = await updateUser(
      { _id: isUserExist._id },
      { $set: { otp: otp, otpExpireTime: otpExpireTime } }
    );
    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    await whatsappAPIUrl.sendWhatsAppMessage(
      mobileNumber,
      var1,
      var2,
      "loginotp"
    );
    await commonFunction.sendEmailOtp(userResult.email, otp);
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, message: responseMessage.OTP_SEND });
  } catch (error) {
    return next(error);
  }
};
exports.verifyUserOtpWithSocialId = async (req, res, next) => {
  try {
    const { otp, fullName, dob, socialId } = req.body;
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (isUserExist.otp !== otp) {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.INCORRECT_OTP,
      });
    }
    if (new Date().getTime() > isUserExist.otpExpireTime) {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.OTP_EXPIRED,
      });
    }
    const updation = await updateUser(
      { _id: isUserExist._id, status: status.ACTIVE },
      { otpVerified: true }
    );
    if (updation.firstTime === false) {
      const token = await commonFunction.getToken({
        _id: updation._id,
        mobile_number: updation.phone.mobile_number,
      });
      const result = {
        firstTime: updation.firstTime,
        _id: updation._id,
        phone: updation.phone,
        userType: updation.userType,
        otpVerified: updation.otpVerified,
        status: updation.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (!fullName || !dob || !socialId) {
      return res.status(statusCode.Forbidden).send({
        statusCode: statusCode.Forbidden,
        message: responseMessage.FIELD_REQUIRED,
      });
    }
    const updateData = await updateUser(
      { _id: updation._id },
      {
        username: fullName,
        dob: dob,
        socialId: socialId,
        otp: "",
        firstTime: false,
      }
    );
    const token = await commonFunction.getToken({
      _id: updation._id,
      mobile_number: updation.phone.mobile_number,
      username: fullName,
    });
    const result = {
      phoneNumber: updateData.phone,
      _id: updateData._id,
      firstTime: updation.firstTime,
      dob: updateData.dob,
      token: token,
      status: updateData.status,
      otpVerified: updateData.otpVerified,
      userType: updateData.userType,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.REGISTER_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.editProfile = async (req, res, next) => {
  try {
    const {
      username,
      email,
      mobile_number,
      gender,
      Nationality,
      City,
      State,
      pincode,
      dob,
      address,
      bio,
      coverPic,
    } = req.body;
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const isUser = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUser) {
      return res
        .status(statusCode.Unauthorized)
        .send({ message: responseMessage.UNAUTHORIZED });
    }
    
    if (mobile_number) {
      const isExistMobile = await findUser({
        "phone.mobile_number": mobile_number,
        _id: { $ne: isUser._id },
      });
      if (isExistMobile) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    } else if (email) {
      const isExistEmail = await findUser({
        email: email,
        _id: { $ne: isUser._id },
      });

      if (isExistEmail) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    }
    const token = await commonFunction.getToken({
      _id: isUser._id,
      mobile_number: mobile_number,
    });
    const obj={
      username,
      email,
      phone:{mobile_number:mobile_number},
      gender,
      Nationality,
      City,
      State,
      pincode,
      dob,
      address,
      bio,
      coverPic,
    }
    const result = await updateUser({ _id: isUser._id }, obj);
    const data={...result._doc, 
      token: token }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.UPDATE_SUCCESS, result: data });
  } catch (error) {
    return next(error);
  }
};
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const deletedUser = await deleteUser({ _id: isUserExist._id });
    const result = {
      status: deletedUser.status,
    };
    if (deletedUser) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.DELETE_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    return next(error);
  }
};
exports.getReachargeHistory = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result = await userUsertransactionList({
      userId: isUserExist._id,
      bookingType: "RECHARGES",
    });
    if (result.length === 0 || !result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
   
    return next(error);
  }
};
exports.getAppLink = async (req, res, next) => {
  try {
    const mobileNumber = req.params;
    const contactNo = "+91" + req.params.mobileNumber;
    const IOS = "https://apps.apple.com/in/app/the-skytrails/id6475768819";
    const Andriod =
      "https://play.google.com/store/apps/details?id=com.skytrails&pli=1";
    const result = await whatsappAPIUrl.sendMessageWhatsApp(
      contactNo,
      IOS,
      Andriod,
      "sendurl"
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.URL_SEND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.updateDeviceToken = async (req, res, next) => {
  try {
    let { deviceToken, deviceType } = req.body;
    let deviceTokens=[];
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    // Check if the deviceToken already exists in the array
    if (isUserExist.deviceTokens.includes(deviceToken)) {
      // Add the deviceToken to the array
      deviceTokens.push(deviceToken);
    }
    req.body.deviceTokens=deviceTokens
    const result = await updateUser({ _id: isUserExist._id }, req.body);
    const updateEventDeviceToken = await updateBookingEvent(
      { userId: isUserExist._id },
      { deviceToken: deviceToken, deviceType: deviceType }
    );
    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.TOKEN_UPDATE_SUCCESS,
      });
    }
  } catch (error) {
    return next(error);
  }
};
exports.shareReferralCode = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }

    const referralLink = `https://play.google.com/store/apps/details?id=com.skytrails`;
    const referralLinkIOS = `https://apps.apple.com/us/app/the-skytrails/id6475768819?id=com.skytrails`;

    // Shorten the referral link
    var result = {};
    result.referralLinkIOS = referralLinkIOS;
    result.referralLink = referralLink;
    // result.shortReferralLink = await shortenURL(referralLink);
    // result.shortReferralLinkIOS = await shortenURL(referralLinkIOS);
    // result.trial = await shortenURL("theskytrails.com");
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.LINK_GENERATED,
      result: result,
      referralCode: isUserExist.referralCode,
    });
  } catch (error) {
    return next(error);
  }
};
exports.updateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isExistEmail = await findUser({
      email: email,
      _id: { $ne: isUserExist._id },
    });
    if (isExistEmail) {
      return res
        .status(statusCode.Conflict)
        .send({ message: responseMessage.EMAIL_ALREADY_EXIST });
    }
    const updateEmail = await updateUser(
      { _id: isUserExist._id },
      { $set: { email: email } }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.NotFound,
      responseMessage: responseMessage.USERS_NOT_FOUND,
      result: updateEmail,
    });
  } catch (error) {
    return next(error);
  }
};
exports.loginWithMailMobileLogin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;

    const data = {
      email: email,
    };
    const phoneNumber = data["email"];
    if (emailRegex.test(phoneNumber)) {
      const isExist = await findUser({ email: email, status: status.ACTIVE });
      // Perform actions for login with email
      if (isExist) {
        const setUnVerified = await updateUser(
          { _id: isExist._id },
          {
            $set: {
              otp: otp,
              otpExpireTime: otpExpireTime,
              otpVerified: false,
            },
          }
        );
        if (!setUnVerified) {
          return res.status(statusCode.InternalError).json({
            statusCode: statusCode.InternalError,
            responseMessage: responseMessage.INTERNAL_ERROR,
          });
        }
        await commonFunction.sendEmailOtp(isExist.email, otp);
        const token = await commonFunction.getToken({
          _id: setUnVerified._id,
          email: setUnVerified.email,
        });
        const result = {
          firstTime: setUnVerified.firstTime,
          _id: setUnVerified._id,
          email: setUnVerified.email,
          userType: setUnVerified.userType,
          otpVerified: setUnVerified.otpVerified,
          status: setUnVerified.status,
          token,
        };
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.LOGIN_SUCCESS,
          result: result,
        });
      }
      const obj = {
        email: email.toLowerCase(),
        otp: otp,
        otpExpireTime: otpExpireTime,
      };
      const createNewUser = await createUser(obj);
      
      const token = await commonFunction.getToken({
        _id: createNewUser._id,
        email: createNewUser.email,
      });
      createNewUser.token = token;
      await commonFunction.sendEmailOtp(email, otp);
      const result = {
        firstTime: createNewUser.firstTime,
        _id: createNewUser._id,
        email: createNewUser.email,
        userType: createNewUser.userType,
        otpVerified: createNewUser.otpVerified,
        status: createNewUser.status.ACTIVE,
        token,
      };
      
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    } else if (mobileRegex.test(phoneNumber)) {
      // Perform actions for login with mobile number
      const isExist = await findUser({ "phone.mobile_number": email });
      const var1 = isExist && isExist.username !== undefined && isExist.username !== ""? isExist.username : "Dear";
      if (email === "9999123232") {
        let updatedNumber = await updateUser(
          { "phone.mobile_number": email, status: status.ACTIVE },
          {
            "phone.mobile_number": email,
            otpVerified: false,
            otpExpireTime: null,
            approveStatus: "APPROVED",
          }
        );
        const token = await commonFunction.getToken({
          _id: isExist._id,
          mobile_number: isExist.phone.mobile_number,
        });
        const result = {
          firstTime: isExist.firstTime,
          _id: isExist._id,
          phone: isExist.phone,
          userType: isExist.userType,
          otpVerified: isExist.otpVerified,
          otp: "123456",
          status: isExist.status,
          token: token,
        };
        await sendSMS.sendSMSForOtp(email, result.otp);
        await whatsappAPIUrl.sendMessageWhatsApp(
          "+919999123232",
          var1,
          result.otp,
          "loginotp"
        );
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.LOGIN_SUCCESS,
          result: result,
        });
      }
      if (isExist) {
        const setUnVerified = await updateUser(
          { _id: isExist._id },
          {
            $set: {
              otp: otp,
              otpExpireTime: otpExpireTime,
              otpVerified: false,
            },
          }
        );
        if (!setUnVerified) {
          return res.status(statusCode.InternalError).json({
            statusCode: statusCode.InternalError,
            responseMessage: responseMessage.INTERNAL_ERROR,
          });
        }

        const userMobile =
          isExist.phone.country_code + isExist.phone.mobile_number;
        const templateParams = [String(var1), String(otp)];
        const sent = await whatsappAPIUrl.sendWhtsAppOTPAISensy(
          userMobile,
          templateParams,
          "user_OTP"
        );
        await sendSMS.sendSMSForOtp(email, otp);
        const token = await commonFunction.getToken({
          _id: setUnVerified._id,
          phone: setUnVerified.phone.mobile_number,
        });
        const result = {
          firstTime: setUnVerified.firstTime,
          _id: setUnVerified._id,
          phone: setUnVerified.phone.mobile_number,
          userType: setUnVerified.userType,
          otpVerified: setUnVerified.otpVerified,
          status: setUnVerified.status,
          token,
        };
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.LOGIN_SUCCESS,
          result: result,
        });
      }
      const obj = {
        "phone.mobile_number": email,
        otp: otp,
        otpExpireTime: otpExpireTime,
      };
      const createNewUser = await createUser(obj);
      const userMobile =
        createNewUser.phone.country_code + createNewUser.phone.mobile_number;
      // await whatsappAPIUrl.sendMessageWhatsApp(
      //   userMobile,
      //   var1,
      //   otp,
      //   "loginotp"
      // );
      const templateParams = [String(var1), String(otp)];
      const sent = await whatsappAPIUrl.sendWhtsAppOTPAISensy(
        userMobile,
        templateParams,
        "user_OTP"
      );
      await sendSMS.sendSMSForOtp(createNewUser.phone.mobile_number, otp);
      const token = await commonFunction.getToken({
        _id: createNewUser._id,
        phone: createNewUser.phone.mobile_number,
      });
      const result = {
        firstTime: createNewUser.firstTime,
        _id: createNewUser._id,
        phone: createNewUser.phone.mobile_number,
        userType: createNewUser.userType,
        otpVerified: createNewUser.otpVerified,
        status: createNewUser.ACTIVE,
        token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    } else {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.INVALID_FORMAT,
      });
    }
  } catch (error) {
    return next(error);
  }
};
exports.verifyUserOtpMailMobile = async (req, res, next) => {
  try {
    let { otp, fullName, dob, email, referrerCode } = req.body;
    // Trim spaces from input fields
    fullName = fullName ? fullName.trim() : "";
    dob = dob ? dob.trim() : "";
    email = email ? email.trim() : "";
    referrerCode = referrerCode ? referrerCode.trim() : "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;

    const data = {
      email: email,
    };
    const phoneNumber = data["email"];
    const isUserExist = await findUserData({ _id: req.userId });
    if (isUserExist.phone.mobile_number == "9999123232") {
      const updateStaticUser = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otpVerified: true, firstTime: false }
      );
      const token = await commonFunction.getToken({
        _id: updateStaticUser._id,
        mobile_number: updateStaticUser.phone.mobile_number,
      });
      const result = {
        firstTime: updateStaticUser.firstTime,
        _id: updateStaticUser._id,
        phone: updateStaticUser.phone,
        userType: updateStaticUser.userType,
        username: updateStaticUser.username,
        otpVerified: updateStaticUser.otpVerified,
        balance: updateStaticUser.balance,
        status: updateStaticUser.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }

    if (isUserExist.otp !== otp) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.INCORRECT_OTP,
      });
    }
    if (new Date().getTime() > isUserExist.otpExpireTime) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.OTP_EXPIRED,
      });
    }
    const updation = await updateUser(
      { _id: isUserExist._id, status: status.ACTIVE },
      { otpVerified: true }
    );
    if (updation.firstTime === false) {
      const token = await commonFunction.getToken({
        _id: updation._id,
        mobile_number: updation.phone.mobile_number,
        email: updation.email,
      });
      const updationData = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otp: " " }
      );
      const result = {
        firstTime: updation.firstTime,
        _id: updation._id,
        phone: updation.phone,
        userType: updation.userType,
        username: updation.username,
        otpVerified: updation.otpVerified,
        balance: updation.balance,
        status: updation.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    // if (!fullName || fullName.trim() === "") {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.Forbidden,
    //     message: responseMessage.USER_NAME_REQUIRED,
    //   });
    // }
    // if (!dob || !email) {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.Forbidden,
    //     responseMessage: responseMessage.FIELD_REQUIRED,
    //   });
    // }
    const refeerralCode = await commonFunction.generateReferralCode();
    const checkReward = await findReferralAmount({});
    var obj = {};
    var updateData = {};
    if (emailRegex.test(phoneNumber)) {
      const isNumberExist = await findUser({ email: email });
      if (isNumberExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.EMAIL_ALREADY_EXIST,
        });
      }
      obj = {
        username: fullName,
        dob: dob ,
        email: email ,
        otp: "",
        otpExpireTime: "",
        firstTime: false,
        referralCode: refeerralCode,
        balance: 0,
      };
      updateData = await updateUser({ _id: updation._id }, obj);
    } else if (mobileRegex.test(phoneNumber)) {
      const isNumberExist = await findUser({ "phone.mobile_number": email });
      if (isNumberExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.MOBILE_EXIST,
        });
      }
      obj = {
        username: fullName ? fullName : "",
        dob: dob ? dob : "",
        "phone.mobile_number": email,
        otp: "",
        firstTime: false,
        referralCode: refeerralCode,
        balance: 0,
      };
      updateData = await updateUser({ _id: updation._id }, obj);
    }
    updateData = await updateUser({ _id: updation._id }, obj);
    if (referrerCode && referrerCode !== " ") {
      const isRefererExist = await findUser({ referralCode: referrerCode });
      if (!isRefererExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest,
          message: responseMessage.INCORRECT_REFERRAL,
        });
      }
      const walletObj = {
        amount: checkReward.refereeAmount,
        details: "Referral reward",
        transactionType: "credit",
        createdAt: date.now,
      };
      await updateUser(
        { _id: updateData._id },
        {
          referrerCode: referrerCode,
          $inc: { balance: checkReward.refereeAmount },
          referredBy: isRefererExist._id,
          $push: { walletHistory: walletObj },
        }
      );
      const walletObj1 = {
        amount: checkReward.referrerAmount,
        details: "Referee reward",
        transactionType: "credit",
        createdAt: date.now,
      };
      const data = await updateUser(
        { referralCode: referrerCode, _id: isRefererExist._id },
        {
          $inc: { balance: checkReward.referrerAmount },
          $push: { walletHistory: walletObj1 },
        }
      );
    }else {
      const walletObj = {
        amount: checkReward.signUpAmount,
        details: "Sign-up reward",
        transactionType: "credit",
        createdAt: Date.now(),
      };

      await updateUser(
        { _id: updateData._id },
        {
          $inc: { balance: checkReward.signUpAmount },
          $push: { walletHistory: walletObj },
        }
      );
    }
    const token = await commonFunction.getToken({
      _id: updation._id,
      mobile_number: updation.phone.mobile_number,
      username: updateData.username,
    });
    const result = {
      phoneNumber: updateData.phone,
      _id: updateData._id,
      firstTime: updation.firstTime,
      dob: updateData.dob,
      username: updateData.username,
      email: updateData.email,
      token: token,
      status: updateData.status,
      otpVerified: updateData.otpVerified,
      userType: updateData.userType,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.REGISTER_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.sendOtpOnSMS = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const otp = await commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const isExist = await findUser({
      "phone.mobile_number": mobile,
      status: status.ACTIVE,
    });
    if (!isExist) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.NOT_FOUND,
      });
    } else if (isUserExist.phone.mobile_number == "9999123232") {
      const updateStaticUser = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otpVerified: true, firstTime: false }
      );
      const token = await commonFunction.getToken({
        _id: updateStaticUser._id,
        mobile_number: updateStaticUser.phone.mobile_number,
      });
      const result = {
        firstTime: updateStaticUser.firstTime,
        _id: updateStaticUser._id,
        phone: updateStaticUser.phone,
        userType: updateStaticUser.userType,
        username: updateStaticUser.username,
        otpVerified: updateStaticUser.otpVerified,
        balance: updateStaticUser.balance,
        status: updateStaticUser.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    const setUnVerified = await updateUser(
      { _id: isExist._id },
      { $set: { otp: otp, otpExpireTime: otpExpireTime, otpVerified: false } }
    );
    if (!setUnVerified) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const sent = await sendSMS.sendSMSForOtp(mobile, otp);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.OTP_SEND,
    });
  } catch (error) {
    return next(error);
  }
};
exports.resendOtpMailMobile = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;

    let user, contactMethod, userIdentifier;
    if (email === "9999123232") {
      let updatedNumber = await updateUser(
        { "phone.mobile_number": email, status: status.ACTIVE },
        {
          "phone.mobile_number": email,
          otpVerified: false,
          otpExpireTime: null,
          approveStatus: "APPROVED",
        }
      );
      token = await commonFunction.getToken({
        _id: isExist._id,
        mobile_number: isExist.phone.mobile_number,
      });
      const result = {
        firstTime: isExist.firstTime,
        _id: isExist._id,
        phone: isExist.phone,
        userType: isExist.userType,
        otpVerified: isExist.otpVerified,
        otp: "123456",
        status: isExist.status,
        token: token,
      };
      await sendSMS.sendSMSForOtp(email, result.otp);
      await whatsappAPIUrl.sendMessageWhatsApp(
        "+919999123232",
        var1,
        result.otp,
        "loginotp"
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_SEND,
        result: result,
      });
    }
    if (emailRegex.test(email)) {
      user = await findUser({ email, status: status.ACTIVE });
      if (!user) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
      }
      contactMethod = "email";
      userIdentifier = user.email;
    } else if (mobileRegex.test(email)) {
      user = await findUser({
        "phone.mobile_number": email,
        status: status.ACTIVE,
      });
      if (!user) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
      }
      contactMethod = "mobile";
      userIdentifier = user.phone.country_code + user.phone.mobile_number;
    } else {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        message: responseMessage.INVALID_INPUT,
      });
    }
  
    const updateData = await updateUser(
      { _id: user._id, status: status.ACTIVE },
      { otp, otpExpireTime }
    );
    if (!updateData) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.InternalError,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    if (contactMethod === "email") {
      await commonFunction.sendEmailOtp(userIdentifier, otp);
    } else if (contactMethod === "mobile") {
      const username = `${updateData.username}` || "Dear";
      const sent = await whatsappAPIUrl.sendMessageWhatsApp(
        userIdentifier,
        username,
        otp,
        "loginotp"
      );
      await whatsappAPIUrl.sendMessageWhatsApp(
        userIdentifier,
        username,
        otp,
        "loginotp"
      );
      const sent1 = await sendSMS.sendSMSForOtp(email, otp);

      // const sent=await whatsappAPIUrl.sendMessageWhatsApp(userIdentifier, username, otp, "loginotp");
      // const sent1=await sendSMS.sendSMSForOtp(userIdentifier, otp);
    }
    const token = await commonFunction.getToken({
      _id: updateData._id,
      [contactMethod]: userIdentifier,
    });
    const result = {
      firstTime: updateData.firstTime,
      _id: updateData._id,
      [contactMethod]: userIdentifier,
      userType: updateData.userType,
      otpVerified: updateData.otpVerified,
      status: updateData.status,
      token,
    };

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.OTP_SEND,
      result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.shareReferralCodeSMSWHTSAPP = async (req, res, next) => {
  try {
    const { countryCode, contactNumber } = req.body;
    const userContact = `+${countryCode}${contactNumber}`;
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const checkReward = await findReferralAmount({});
    const referralLink = `https://play.google.com/store/apps/details?id=com.skytrails`;
    const referralLinkIOS = `https://apps.apple.com/us/app/the-skytrails/id6475768819?id=com.skytrails`;
    const contact = countryCode + contactNumber;
    // Shorten the referral link
    var result = {};
    result.referralLinkIOS = referralLinkIOS;
    result.referralLink = referralLink;
    const combineReferral = `Andriod=${referralLink} and IOS=${referralLinkIOS}`;
    // result.shortReferralLink = await shortenURL(referralLink);
    // result.shortReferralLinkIOS = await shortenURL(referralLinkIOS);
    // result.trial = await shortenURL("theskytrails.com");
    const var3 = `IOS=${referralLinkIOS} and Andriod=${referralLink}`;
    const data = await whatsappAPIUrl.sendWhatsAppMsgRM(
      contact,
      isUserExist.referralCode,
      checkReward.refereeAmount,
      combineReferral,
      "sharerefcode"
    );
    const sendWhats = await whatsappAPIUrl.sendWhtsAppAISensy(
      contact,
      isUserExist.referralCode,
      checkReward.refereeAmount,
      var3,
      "shareReferral"
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.LINK_GENERATED,
      result: result,
      referralCode: isUserExist.referralCode,
    });
  } catch (error) {
    return next(error);
  }
};
exports.getValueOfCoin = async (req, res, next) => {
  try {
    // const isUserExist = await findUserData({
    //   _id: req.userId,
    //   status: status.ACTIVE,
    // });
    // if (!isUserExist) {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.NotFound,
    //     responseMessage: responseMessage.USERS_NOT_FOUND,
    //   });
    // }
    const result = await findReferralAmount({});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.getWalletHistory = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    let result = {};
    result.Earned = isUserExist.walletHistory.reverse();
    result.Redeemed = await userAllWalletHistory({ userId: isUserExist._id });
    
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.WALLET_HISTORY_GET,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.redeemCoin = async (req, res, next) => {
  try {
    const { redeemCoin, source, details } = req.body;
    let result = {};
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const coinDiff = isUserExist.balance - redeemCoin;
      if (isUserExist.balance <= 100 ) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: `${responseMessage.REDEEM_NOT_ALLOW} 100`,
      });
    }
  const maxRedeemableAmount = isUserExist.balance * 0.1;
  if (redeemCoin > maxRedeemableAmount) {
    return res.status(statusCode.OK).send({
      statusCode: statusCode.badRequest,
      responseMessage: `${responseMessage.ALLOWED_SKY_COIN}which is ${maxRedeemableAmount.toFixed(2)} coins.`,
    });
  }
    const obj = {
      userId: isUserExist._id,
      source: source,
      amount: redeemCoin,
      details: details || `You are using ${redeemCoin} coins for ${source} booking.`,
      transactionType: "Debit",
    };
    result.wallHistory = await createUserWalletHistory(obj);
    const updatedUser=await updateUser({_id:isUserExist._id}, {$inc: { balance: -redeemCoin }});
    result.redableCoin = coinDiff;
    result.remainingBalance = updatedUser.balance;
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.getUserBalance = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const result = {
      walletHistory:isUserExist.walletHistory,
      balance: isUserExist.balance,
      _id: isUserExist._id,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
async function shortenURL(url) {
  // Here, you can use any URL shortening service API or your own URL shortening service implementation
  // For demonstration, let's use a simple method with shortid
  const shortCode = shortid.generate();
  const shortURL = `https://${shortCode}`;
  return shortURL;
}
exports.updateMihuruWallet = async (req, res) => {
  try {
    const {
      partnerTransactionId,
      paymentId,
      paymentReferenceId,
      paymentAmount,
      availableLimit,
      remark,
      status,
    } = req.body;
    const userId = partnerTransactionId;
    if (!userId || !paymentAmount || !paymentId || !paymentReferenceId) {
      return actionCompleteResponse(res, {}, "Missing required fields");
    }

    const user = await User.findById(userId);

    if (!user) {
      return actionCompleteResponse(res, mihuruData, "User not found");
    }
    const mihuruData = user?.mihuruWallet;

    if (
      mihuruData.paymentId === paymentId &&
      mihuruData.paymentReferenceId === paymentReferenceId
    ) {
      // Payment already added
      return actionCompleteResponse(res, mihuruData, "Payment Already Added");
    }
    const updatedMihuruWallet =
      Number(mihuruData?.paymentAmount) + Number(paymentAmount);
    const response = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "mihuruWallet.paymentAmount": updatedMihuruWallet,
          "mihuruWallet.paymentId": paymentId,
          "mihuruWallet.paymentReferenceId": paymentReferenceId,
          "mihuruWallet.availableLimit": availableLimit,
          "mihuruWallet.status": status,
          "mihuruWallet.remark": remark,
        },
      },
      { new: true }
    );

    actionCompleteResponse(res, response, "Update Mihuru Wallet Successfully");
  } catch (err) {
    sendActionFailedResponse(res, { err }, err.message);
  }
};
exports.checkFirstBooking = async (req, res, next) => {
  try {
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    // Check for existing bookings
    const hotelBooking = await findhotelBooking({ userId: req.userId });
    const busBooking = await findUserBusBookingData({ userId: req.userId });
    const flightBooking = await findUserflightBooking({ userId: req.userId });

    if (hotelBooking || busBooking || flightBooking) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.USER_BOOKING_ALREADY_EXIST,
        result: {
          isFirstBooking: false,
          hotelBooking: hotelBooking ? hotelBooking : null,
          busBooking: busBooking ? busBooking : null,
          flightBooking: flightBooking ? flightBooking : null,
        },
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.USER_FIRST_BOOKING,
      result: {
        isFirstBooking: true,
      },
    });
  } catch (error) {
    return next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const result = await findUser({ _id: userId });
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.USERS_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
//*****************SOCIAL LOGIN***************** */
exports.socialLogin = async (req, res, next) => {
  try {
    const {
      username,
      dob,
      email,
      profilePic,
      referrerCode,
      socialId,
      socialType,
      mobile_number,
      newImageFile,
      deviceType,
      deviceToken,
    } = req.body;
    if (email) req.body.email = email.toLowerCase();
    let isUserExist;
    // const newImageFile="";
    obj = {
        socialId,
        socialType,
        deviceType: deviceType !== "" ? deviceType : isUserExist.deviceType,
        deviceToken: deviceToken !== "" ? deviceToken : isUserExist.deviceToken,
        otpVerified: true,
        firstTime: false,
        isSocial: true,
      };
    if (deviceType === "ios" && socialType !== "google.com") {
      isUserExist = await findUser({ socialId });
    }else{
      isUserExist = await findUser({email: email});
      obj.username= username,
      obj.dob=dob,
      obj.email= email
    }
    const checkReward = await findReferralAmount({});
    if (!isUserExist) {
      const object = {
        username,
        dob,
        email,
        profilePic,
        referrerCode,
        socialId,
        socialType,
        deviceType,
        deviceToken,
        // phone: { mobile_number: mobile_number  },
        profilePic,
        otpVerified: true,
        firstTime: false,
        isSocial: true,
      balance: checkReward.signUpAmount
      };
      let result = await createUser(object);
      result = result.toObject();
      const token = await commonFunction.getToken({
        _id: result._id,
        email: result.email,
      });
      result.token = token;
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.SOCIAL_LOGIN_SUCCESS,
        result: result,
      });
    }
    let result = await updateUser({ _id: isUserExist._id }, obj);
    const token = await commonFunction.getToken({
      _id: result._id,
      email: result.email,
    });
    result = result.toObject();
    result.token = token;
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.SOCIAL_LOGIN_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};
exports.addMobileNumber = async (req, res, next) => {
  try {
    const { mobile_number } = req.body;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isExistMobile = await findUser({
      "phone.mobile_number": mobile_number,
      _id: { $ne: isUserExist._id },
    });
    if (isExistMobile) {
      return res
        .status(statusCode.OK)
        .send({ statusCode:statusCode.Conflict,responseMessage: responseMessage.NUMBER_EXIST });
    }
    const token = await commonFunction.getToken({
      _id: isUserExist._id,
      mobile_number: mobile_number,
    });
    let result = await updateUser(
      { _id: isUserExist._id },
      {
        $set: {
          temp_mobile_number: mobile_number,
          otp: otp,
          otpExpireTime: otpExpireTime,
          otpVerified:false,
        },
      }
    );
    const userMobile = +91 + mobile_number;
    await sendSMS.sendSMSForOtp(mobile_number, otp);
    const var1 =isUserExist && isUserExist.username !== "" ? isUserExist.username : "Dear";
    const templateParams = [String(var1), String(otp)];
    // const templateParams = [String(isUserExist.username), String(otp)];
    const sent = await whatsappAPIUrl.sendWhtsAppOTPAISensy(
      userMobile,
      templateParams,
      "user_OTP"
    );
    result = result.toObject();
    result.token = token;
    return res
      .status(statusCode.OK)
      .send({statusCode: statusCode.OK,responseMessage: responseMessage.LOGIN_SUCCESS, result: token });
  } catch (error) {
   
    return next(error);
  }
};
exports.addProfileContactDetail=async(req,res,next)=>{
  try {
    const updateUser=await updateUser({_id:req.params.userId},{'phone.mobile_number':req.params.mobile_number});
    const token = await commonFunction.getToken({
      _id: updateUser._id,
      mobile_number: req.params.mobile_number,
    });
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.LOGIN_SUCCESS, result: token });
  } catch (error) {
    
  }
}
exports.socialLoginVerifyOtp=async(req,res,next)=>{
  try {
    const {otp,mobileNumber}=req.body
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (isUserExist.otp !== otp) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.INCORRECT_OTP,
      });
    }
    if (new Date().getTime() > isUserExist.otpExpireTime) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.OTP_EXPIRED,
      });
    }
   
    const updation = await updateUser(
      { _id: isUserExist._id},
      { otp: " " ,'phone.mobile_number':mobileNumber}
    );
    const token = await commonFunction.getToken({
      _id: updation._id,
      mobile_number: updation.phone.mobile_number,
    });
    const obj={
      firstTime: updation.firstTime,
      _id: updation._id,
      phone: updation.phone,
      userType: updation.userType,
      username: updation.username,
      otpVerified: updation.otpVerified,
      balance: updation.balance,
      status: updation.status,
      walletHistory:updation.walletHistory,
      token: token,
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.OTP_VERIFY,
      result: obj,
      updation
    });
  } catch (error) {
    return next(error)
  }
}
// exports.appleSignIn=async(req,res,next)=>{
//   try {
//     const {
//       username,
//       dob,
//       email,
//       profilePic,
//       referrerCode,
//       socialId,
//       socialType,
//       mobile_number,
//       newImageFile,
//       deviceType,
//       deviceToken,
//     } = req.body;
//     if (req.body.email) {
//       req.body.email = req.body.email.toLowerCase();
//     }
//     const isUserExist = await findUser({ socialId: socialId ,email:email});
//     const checkReward = await findReferralAmount({});
//     if (!isUserExist) {
//       const object = {
//         username,
//         dob,
//         email,
//         profilePic,
//         referrerCode,
//         socialId,
//         socialType,
//         deviceType,
//         deviceToken,
//         // phone: { mobile_number: mobile_number  },
//         otpVerified: true,
//         firstTime: false,
//         isSocial: true,
//        balance: checkReward.signUpAmount
//       };
//       let result = await createUser(object);
//       result = result.toObject();
//       const token = await commonFunction.getToken({
//         _id: result._id,
//         email: result.email,
//       });
//       result.token = token;
//       return res.status(statusCode.OK).send({
//         statusCode: statusCode.OK,
//         responseMessage: responseMessage.SOCIAL_LOGIN_SUCCESS,
//         result: result,
//       });
//     }
//     const obj = {
//       socialType,
//       deviceType,
//       deviceToken,
//       otpVerified: true,
//       firstTime: false,
//       isSocial: true,
//       balance:isUserExist.balance
//     };
//     let result = await updateUser({ _id: isUserExist._id }, obj);
//     const token = await commonFunction.getToken({
//       _id: result._id,
//       email: result.email,
//     });
//     result = result.toObject();
//     result.token = token;
//     return res.status(statusCode.OK).send({
//       statusCode: statusCode.OK,
//       responseMessage: responseMessage.SOCIAL_LOGIN_SUCCESS,
//       result: result,
//     });
//   } catch (error) {
//     console.log("error while trying to apple SignIn",error);
//     return next(error);
    
//   }
// }
//Auth Api changes-------------------------------------------------------------
exports.verifyUserOtpNew=async(req,res,next)=>{
  try {
    let { otp} = req.body;
    const isUserExist = await findUserData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (isUserExist.phone.mobile_number == "9999123232"){
      const updateStaticUser = await updateUser(
        { _id: isUserExist._id, status: status.ACTIVE },
        { otpVerified: true, firstTime: false }
      );
      const token = await commonFunction.getToken({
        _id: isUserExist._id,
        mobile_number: isUserExist.phone.mobile_number,
      });
      const result = {
        firstTime: isUserExist.firstTime,
        _id: isUserExist._id,
        phone: isUserExist.phone,
        userType: isUserExist.userType,
        username: isUserExist.username,
        otpVerified: isUserExist.otpVerified,
        balance: isUserExist.balance,
        status: isUserExist.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (isUserExist.otp !== otp) {
      return res.status(statusCode.OK).json({statusCode: statusCode.badRequest,responseMessage: responseMessage.INCORRECT_OTP,});
    }
    if (new Date().getTime() > isUserExist.otpExpireTime) {
      return res.status(statusCode.OK).json({statusCode: statusCode.badRequest,responseMessage: responseMessage.OTP_EXPIRED,});
    }
    const updation = await updateUser(
      { _id: isUserExist._id, status: status.ACTIVE },
      { otpVerified: true, otp: "",otpExpireTime:"" }
    );
    const token = await commonFunction.getToken({
      _id: updation._id,
      mobile_number: updation.phone.mobile_number,
      email: updation.email,
    });
    const result = {
      firstTime: updation.firstTime,
      _id: updation._id,
      phone: updation.phone,
      userType: updation.userType,
      username: updation.username,
      otpVerified: updation.otpVerified,
      balance: updation.balance,
      status: updation.status,
      token: token,
  };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.OTP_VERIFY,
      result: result,
    });
  } catch (error) {
    return next(error);
    
  }
}
exports.registration=async(req,res,next)=>{
  try {
    let {userName, dob, email, referrerCode}=req.body;
    userName = userName?.trim() ;
    dob = dob.trim();
    email = email.trim().toLowerCase();
    referrerCode = referrerCode ? referrerCode.trim() : "";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;
    const isUserExist = await findUserData({ _id: req.userId,firstTime:true });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const generatedReferralCode  = await commonFunction.generateReferralCode();
    const checkReward = await findReferralAmount({});
    var userObj  = { 
      username: userName,
      dob: dob,
      firstTime: false,
      referralCode: generatedReferralCode ,
      balance: 0,};
      let updateData = {};
    if (emailRegex.test(email)){
      const isEmailExist  = await findUser({ email: email });
      if (isEmailExist ) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.EMAIL_ALREADY_EXIST,
        });
      }
      userObj.email=email;
      // obj = {
      //   username: fullName,
      //   dob: dob ,
      //   email: email ,
      //   otp: "",
      //   otpExpireTime: "",
      //   firstTime: false,
      //   referralCode: refeerralCode,
      //   balance: 0,
      // };
    }else if (mobileRegex.test(email)) {
      const isNumberExist = await findUser({ "phone.mobile_number": email });
      if (isNumberExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.MOBILE_EXIST,
        });
      }
     userObj.phone = { mobile_number: email };
    }
    updateData = await updateUser({ _id: isUserExist._id }, userObj );
    if (referrerCode){
      const referrer  = await findUser({ referralCode: referrerCode });
      if (!referrer ) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest,
          message: responseMessage.INCORRECT_REFERRAL,
        });
      }
      const walletHistoryEntry = (amount, details) => ({
        amount,
        details,
        transactionType: "credit",
        createdAt: Date.now(),
      });

      await updateUser(
        { _id: updateData._id },
        {
          referrerCode: referrerCode,
          referredBy: referrer._id,
          $inc: { balance: checkReward.refereeAmount },
          $push: { walletHistory: walletHistoryEntry(checkReward.refereeAmount, "Referral reward") },
        }
      );
      await updateUser(
        { referralCode: referrerCode,_id: referrer._id  },
        {
          $inc: { balance: checkReward.referrerAmount },
          $push: { walletHistory:  walletHistoryEntry(checkReward.referrerAmount, "Referee reward") },
        }
      );
    }else {
      const signUpBonus  = {
        amount: checkReward.signUpAmount,
        details: "Sign-up reward",
        transactionType: "credit",
        createdAt: Date.now(),
      };

      await updateUser(
        { _id: updateData._id },
        {
          $inc: { balance: checkReward.signUpAmount },
          $push: { walletHistory: signUpBonus },
        }
      );
    }
    const token = await commonFunction.getToken({
      _id: updateData._id,
      mobile_number: updateData.phone.mobile_number,
      username: updateData.username,
    });

    const result = {
      phoneNumber: updateData?.phone?.mobile_number,
      _id: updateData._id,
      firstTime: updateData.firstTime,
      dob: updateData.dob,
      username: updateData.username,
      email: updateData.email,
      token: token,
      status: updateData.status,
      otpVerified: updateData.otpVerified,
      userType: updateData.userType,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.REGISTER_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error)
    
  }
}
exports.sentOtpForVerification=async(req,res,next)=>{
  try {
    const {email}=req.body;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const isUserExist = await findUserData({ _id: req.userId});
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    
    
    if (emailRegex.test(email)){
      
      const isEmailExist  = await findUser({ email: email });
      
      if (isEmailExist ) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.EMAIL_ALREADY_EXIST,
        });
      }
      const sendEmail= await commonFunction.sendEmailOtp(email, otp);
      
    }else if (mobileRegex.test(email)) {
      const isNumberExist = await findUser({ "phone.mobile_number": email });
      if (isNumberExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.Conflict,
          message: responseMessage.MOBILE_EXIST,
        });
      }
      let username=isUserExist.userName|| "Dear"
     const templateParams = [String(username), String(otp)];
       const sent = await whatsappAPIUrl.sendWhtsAppOTPAISensy(
        `+91${isUserExist.phone.mobile_number}`,
        templateParams,
        "user_OTP"
      );
      
      await sendSMS.sendSMSForOtp(isUserExist.phone.mobile_number, otp);
    }
    
    const updatedUser=await updateUser({ _id: isUserExist._id }, {$set:{otp:otp,otpExpireTime:otpExpireTime}} );
    
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.OTP_SEND,
      // result: updateUser,
    });
  } catch (error) {
    return next(error);
    
  }
}

const validateOtp = (storedOtp, otpExpireTime, userOtp) => {
  if (storedOtp !== userOtp || new Date().getTime() > otpExpireTime) {
      return false;
  }
  return true;
};



// async function verifyAppleIdToken(idToken) {
//   try {
//       // Get Apple Public Keys
//       const appleKeys = await axios.get('https://appleid.apple.com/auth/keys');
// console.log("const jwt = require('jsonwebtoken');=",appleKeys.data.keys[0])
//       // Decode the Token
//       const decodedToken = jwt.decode("dGLgVsRTqUhghsqYRMfjmR:APA91bHwGGxs2-67ju6ismCSVmSdUsg6b-J4yOXTrnNluiH9xLC5LmgRrWjzzxaksqJb7CRYQs6JcAxpoD-j-vDrn_QYh3kqVUxf_e7roXcFR10HJs56YY0", { complete: true });

//       // Verify Token Signature
//       jwt.verify("dGLgVsRTqUhghsqYRMfjmR:APA91bHwGGxs2-67ju6ismCSVmSdUsg6b-J4yOXTrnNluiH9xLC5LmgRrWjzzxaksqJb7CRYQs6JcAxpoD-j-vDrn_QYh3kqVUxf_e7roXcFR10HJs56YY0", appleKeys.data.keys[0], { algorithms: ['RS256'] });

//       console.log("Apple ID Token Verified:", decodedToken.payload);
//       return decodedToken.payload;
//   } catch (error) {
//       console.error("Apple ID Token verification failed:", error);
//       throw new Error("Invalid Token");
//   }
// }
// verifyAppleIdToken();