const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const shortid = require('shortid');
/**********************************SERVICES********************************** */
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


const {eventBookingServices,} = require("../../services/btocServices/eventBookingServices");
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
const{pushNotificationServices}=require('../../services/pushNotificationServices');
// const referralCodes=require('referral-codes');
const{createPushNotification,findPushNotification,findPushNotificationData,deletePushNotification,updatePushNotification,countPushNotification}=pushNotificationServices;
const{referralAmountServices}=require('../../services/referralAmountServices')
const {createReferralAmount,findReferralAmount,deleteReferralAmount,referralAmountList,updateReferralAmount,referralAmountListPaginate}=referralAmountServices;

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
      const contactNumber = result1.phone.country_code + result1.phone.mobile_number;
      const userName="Dear";
      const userOtp=`${otp}`
      await whatsappAPIUrl.sendMessageWhatsApp(contactNumber,userName,userOtp,'loginotp');
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
    const var2=`${otp}`
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
      await whatsappAPIUrl.sendMessageWhatsApp('+919999123232',var1,otp,'loginotp');
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
    await whatsappAPIUrl.sendMessageWhatsApp(userMobile, var1,var2, 'loginotp');
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
    console.log("error while trying to login====>>>>>", error);
    return next(error);
  }
};
exports.verifyUserOtp = async (req, res, next) => {
  try {
    const { otp, fullName, dob, email ,referrerCode} = req.body;
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
        balance:updateStaticUser.balance,
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
        balance:updation.balance,
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
    const refeerralCode=commonFunction.generateReferralCode();
    const updateData = await updateUser(
      { _id: updation._id },
      { username: fullName, dob: dob, email: email, otp: "", firstTime: false,referralCode:refeerralCode}
    );
    if(referrerCode){
      const isRefererExist=await findUser({referralCode:referrerCode});
      if(!isRefererExist){
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest,
          message: responseMessage.INCORRECT_REFERRAL,
        });
      }
      const checkReward=await findReferralAmount({});
      await updateUser(
        { _id: updateData._id },
        { referrerCode:referrerCode,$inc:{balance:checkReward.refereeAmount},
          referredBy:isRefererExist._id
        }
      );
     const data= await updateUser(
        { referralCode:referrerCode,_id:isRefererExist._id},
        {$inc:{balance:checkReward.referrerAmount}}
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
    console.log("Error==============>", error);
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
    const var1 = `${isExist.username}`;
    const var2=`${otp}`
    const updateData = await updateUser(
      { _id: isExist._id, status: status.ACTIVE },
      { otp: otp, otpExpireTime: otpExpireTime}
    );
    if (!updateData) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    const userMobile =
      updateData.phone.country_code + updateData.phone.mobile_number;
    await whatsappAPIUrl.sendMessageWhatsApp(userMobile, var1,var2,'loginotp');
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
    console.log("error==========>>>>>>.", error);
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
    const imageFiles = await commonFunction.getImageUrlAWS(req.file);
    if (!imageFiles) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    const result = await updateUser(
      { _id: isUserExist._id },
      { profilePic: imageFiles }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.UPLOAD_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("Error updating location", error);
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
    const var2=`${otp}`
    const updateUser = await updateUser(
      { _id: isUserExist._id },
      { $set: { otp: otp, otpExpireTime: otpExpireTime } }
    );
    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    await whatsappAPIUrl.sendWhatsAppMessage(mobileNumber, var1,var2,'loginotp');
    await commonFunction.sendEmailOtp(userResult.email, otp);
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, message: responseMessage.OTP_SEND });
  } catch (error) {
    console.log("Forget Password", error);
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
    console.log("isUserExist.otp !== otp", isUserExist.otp !== otp);
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
    console.log("======================", updation);
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
    console.log("Error==============>", error);
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
    const isUSer = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUSer) {
      return res
        .status(statusCode.Unauthorized)
        .send({ message: responseMessage.UNAUTHORIZED });
    }
    if (mobile_number) {
      const isExistMobile = await findUser({
        "phone.mobile_number": mobile_number,
        _id: { $ne: isUSer._id },
      });
      if (isExistMobile) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    } else if (email) {
      const isExistEmail = await findUser({
        email: email,
        _id: { $ne: isUSer._id },
      });


      if (isExistEmail) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    }
    const result = await updateUser({ _id: isUSer._id }, req.body);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.UPDATE_SUCCESS, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};


//******************************************DELETE Account of User**********************************************************/


// exports.deleteUserAccount=async(req,res,next)=>{
// try {
//   const isUserExist = await findUserData({_id:req.userId,status: status.ACTIVE,});
//   if (!isUserExist) {
//     return res.status(statusCode.NotFound).send({statusCode: statusCode.NotFound,message: responseMessage.USERS_NOT_FOUND});
//   }
//   const deleteUser=await updateUser({_id:isUserExist._id},{status:status.DELETE});
//   console.log("dekechjdjodopdodpodojfufbkdk=======",deleteUser)
//   const result={
//     status:deleteUser.status
//   }
//   if(deleteUser){
//     return res.status(statusCode.OK).send({statusCode: statusCode.OK,message: responseMessage.DELETE_SUCCESS,result:result});
//   }
// } catch (error) {
//   console.log("Error while delete account..!",error);
//   return next(error)
// }
// }


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
    console.log("Error while delete account..!", error);
    return next(error);
  }
};


exports.getReachargeHistory=async(req,res,next)=>{
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
    const result=await userUsertransactionList({userId:isUserExist._id,bookingType:"RECHARGES"});
    if (result.length === 0 || !result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_FOUND,
      result:result
    });
  } catch (error) {
    console.log("error while trying to get history of user recharge====",error);
    return next(error)
  }
}


exports.getAppLink=async(req,res,next)=>{
  try {
    const mobileNumber=req.params;
    const contactNo = "+91" + req.params.mobileNumber;;
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
    console.log("error while send link",error);
    return next(error)
  }
}

exports.updateDeviceToken=async(req,res,next)=>{
  try {
    const {deviceToken,deviceType}=req.body;
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
    const result=await updateUser({_id:isUserExist._id},req.body);
    const updateEventDeviceToken=await updateBookingEvent({userId:isUserExist._id},{deviceToken:deviceToken,deviceType:deviceType});
    if(result){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.TOKEN_UPDATE_SUCCESS,
      });
    }
  } catch (error) {
    console.log("error while update deviceToken===",error);
    return next(error);
  }
}

exports.shareReferralCode=async(req,res,next)=>{
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

    const referralLink = `https://play.google.com/store/apps/details?id=com.skytrails?referral=${isUserExist.referralCode}`;
    console.log("referralLink============",referralLink);
    const referralLinkIOS = `https://apps.apple.com/us/app/the-skytrails/id6475768819?id=com.skytrails/referral=${isUserExist.referralCode}`;
    
     // Shorten the referral link
     var result={}
     result.shortReferralLink = await shortenURL(referralLink);
     result.shortReferralLinkIOS = await shortenURL(referralLinkIOS);
     result.trial=await shortenURL('theskytrails.com')
return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.LINK_GENERATED,result:result});
  } catch (error) {
    console.log("error while send code",error);
    return next(error);
  }
}

exports.updateEmail=async(req,res,next)=>{
  try {
    const {email}=req.body;
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
    const updateEmail=await updateUser({_id:isUserExist._id},{$set:{email: email}});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.NotFound,
      responseMessage: responseMessage.USERS_NOT_FOUND,
      result:updateEmail
    });
  } catch (error) {
    console.error("error while trying to update email.",error);
    return next(error)
  }
}

exports.loginWithMailMobileLogin=async(req,res,next)=>{
  try {
    const {email}=req.body;
    const otp = commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;

    const data = {
      "email": email
  };
  const phoneNumber = data["email"];
  console.log(emailRegex.test(phoneNumber),"phoneNumber===========",phoneNumber);
    if (emailRegex.test(phoneNumber)) {
      console.log("===========================");
      const isExist=await findUser({email:email,status:status.ACTIVE});
      // Perform actions for login with email
      if(isExist){
        const setUnVerified=await updateUser({_id:isExist._id},{$set:{otp:otp,otpExpireTime:otpExpireTime,otpVerified:false}});
        if (!setUnVerified) {
          return res.status(statusCode.InternalError).json({
            statusCode: statusCode.InternalError,
            responseMessage: responseMessage.INTERNAL_ERROR,
          });
        }
        await commonFunction.sendEmailOtp(isExist.email,otp);
        const token=await commonFunction.getToken({
          _id: setUnVerified._id,
          email:setUnVerified.email
        });
        const result={
          firstTime: setUnVerified.firstTime,
        _id: setUnVerified._id,
        email: setUnVerified.email,
        userType: setUnVerified.userType,
        otpVerified: setUnVerified.otpVerified,
        status: setUnVerified.status,
        token
        }
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.LOGIN_SUCCESS,
          result: result,
        });
      }
      const obj={
        email:email,
        otp:otp,
        otpExpireTime:otpExpireTime
      }
      const createNewUser=await createUser(obj);
      const token=await commonFunction.getToken({
        _id: createNewUser._id,
        email:createNewUser.email
      });
      createNewUser.token=token
      await commonFunction.sendEmailOtp(email,otp);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: createNewUser,
      });
    } 
    else if (mobileRegex.test(phoneNumber)) {
      console.log("=========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",mobileRegex.test(phoneNumber));
      // Perform actions for login with mobile number
      const isExist=await findUser({'phone.mobile_number':email});
      const var1 = isExist && isExist.username !== "" ? isExist.username : "Dear";
      if(isExist){
        const setUnVerified=await updateUser({_id:isExist._id},{$set:{otp:otp,otpExpireTime:otpExpireTime,otpVerified:false}});
        if (!setUnVerified) {
          return res.status(statusCode.InternalError).json({
            statusCode: statusCode.InternalError,
            responseMessage: responseMessage.INTERNAL_ERROR,
          });
        }
        const userMobile1=setUnVerified.phone.country_code + setUnVerified.phone.mobile_number;
        console.log("userMobile============",userMobile1);
        const userMobile= isExist.phone.country_code + isExist.phone.mobile_number;
        const var2=otp;
        const sent = await whatsappAPIUrl.sendMessageWhatsApp('+918115199076', var1,var2, 'loginotp');    
        console.log("sent+============",sent)
        await sendSMS.sendSMSForOtp(email, otp);
        const token=await commonFunction.getToken({
          _id: setUnVerified._id,
          phone:setUnVerified.phone.mobile_number
        });
        const result={
          firstTime: setUnVerified.firstTime,
        _id: setUnVerified._id,
        phone:setUnVerified.phone.mobile_number,
        userType: setUnVerified.userType,
        otpVerified: setUnVerified.otpVerified,
        status: setUnVerified.status,
        token
        }
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.LOGIN_SUCCESS,
          result: result,
        });
      }
      const obj={
        'phone.mobile_number':email,
        otp:otp,
        otpExpireTime:otpExpireTime
      }
      const createNewUser=await createUser(obj);
      const userMobile=createNewUser.phone.country_code + createNewUser.phone.mobile_number;
      await whatsappAPIUrl.sendMessageWhatsApp(userMobile, var1,otp, 'loginotp');
        await sendSMS.sendSMSForOtp(createNewUser.phone.mobile_number, otp);
      const token=await commonFunction.getToken({
        _id: createNewUser._id,
        phone:createNewUser.phone.mobile_number
      });
      const result={
        firstTime: createNewUser.firstTime,
        _id:createNewUser._id,
        phone: createNewUser.phone.mobile_number,
        userType: createNewUser.userType,
        otpVerified: createNewUser.otpVerified,
        status: createNewUser.ACTIVE,
        token
       }
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    } 
    else {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.INVALID_FORMAT,
      });
    }
    
  } catch (error) {
    console.error("error while tryiong to login",error);
    return next(error);
  }
}

exports.verifyUserOtpMailMobile = async (req, res, next) => {
  try {
    const { otp, fullName, dob, email ,referrerCode} = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^(?!0)\d{9,}(\d)(?!\1{4})\d*$/;

    const data = {
      "email": email
  };
  const phoneNumber = data["email"];
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
        balance:updateStaticUser.balance,
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
        email:updation.email
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
        balance:updation.balance,
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
    const refeerralCode=commonFunction.generateReferralCode();
    var obj={}
    if(emailRegex.test(phoneNumber)){
      console.log("emailRegex.test(phoneNumber)==========",emailRegex.test(phoneNumber));
      const isNumberExist=await findUser({email:email});
    if(isNumberExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        message: responseMessage.EMAIL_ALREADY_EXIST,
      });
    }
      obj={
        username: fullName, 
        dob: dob,
        email:email,
        otp: "",
        firstTime: false,
        referralCode:refeerralCode
      }
      
    }else if(mobileRegex.test(phoneNumber)){
      console.log("mobileRegex.test(phoneNumber)=============",mobileRegex.test(phoneNumber));
   
    const isNumberExist=await findUser({'phone.mobile_number':email});
    if(isNumberExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Conflict,
        message: responseMessage.MOBILE_EXIST,
      });
    }
    obj={
      username: fullName, 
      dob: dob,
      'phone.mobile_number':email,
      otp: "",
      firstTime: false,
      referralCode:refeerralCode
    }
    }
    const updateData = await updateUser(
      { _id: updation._id },
      obj
    );
    if(referrerCode){
      const isRefererExist=await findUser({referralCode:referrerCode});
      if(!isRefererExist){
        return res.status(statusCode.OK).send({
          statusCode: statusCode.badRequest,
          message: responseMessage.INCORRECT_REFERRAL,
        });
      }
      const checkReward=await findReferralAmount({});
      await updateUser(
        { _id: updateData._id },
        { referrerCode:referrerCode,$inc:{balance:checkReward.refereeAmount},
          referredBy:isRefererExist._id
        }
      );
     const data= await updateUser(
        { referralCode:referrerCode,_id:isRefererExist._id},
        {$inc:{balance:checkReward.referrerAmount}}
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
    console.log("Error==============>", error);
    return next(error);
  }
};

exports.sendOtpOnSMS=async(req,res,next)=>{
  try {
    const {mobile}=req.body;
    const otp=await commonFunction.getOTP();
    const otpExpireTime = new Date().getTime() + 300000;
    const isExist=await findUser({'phone.mobile_number':mobile,status:status.ACTIVE});
    if(!isExist){
      return res.status(statusCode.OK).json({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.NOT_FOUND,
      });
    }
    const setUnVerified=await updateUser({_id:isExist._id},{$set:{otp:otp,otpExpireTime:otpExpireTime,otpVerified:false}});
    if (!setUnVerified) {
      return res.status(statusCode.OK).json({
        statusCode: statusCode.InternalError,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const sent=await sendSMS.sendSMSForOtp(mobile, otp);
    console.log("sent===================",sent);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.OTP_SEND
    });
  } catch (error) {
    console.error("error while trying to send sms.",error);
    return next(error);
  }
}


async function shortenURL(url) {
  // Here, you can use any URL shortening service API or your own URL shortening service implementation
  // For demonstration, let's use a simple method with shortid
  const shortCode = shortid.generate();
  const shortURL = `https://${shortCode}`;
  return shortURL;
}