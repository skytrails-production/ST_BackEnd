const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
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
//******************************************User SignUp api*************************/

exports.login = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        message: responseMessage.INVALID_PHONE_NUMBER,
      });
    }
    const isExist = await findUser({
      "phone.mobile_number": mobileNumber,
      userType: userType.USER,
      status: status.ACTIVE,
    });
    const userMobile = isExist.phone.country_code + isExist.phone.mobile_number;
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
      await sendSMS.sendSMSForOtp(mobileNumber, otp);
      const message = `Use this OTP ${otp} to login to your. theskytrails account`;
      await whatsappAPIUrl.sendWhatsAppMessage(userMobile, message);
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
        message: responseMessage.LOGIN_SUCCESS,
        result: result,
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
      const message = `Use this OTP ${result.otp} to login to your. theskytrails account`;
      await whatsappAPIUrl.sendMessageWhatsApp(userMobile, message);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.LOGIN_SUCCESS,
        result: result,
      });
    }
    obj.otpVerified = false;
    let updatedUser = await updateUser(
      { "phone.mobile_number": mobileNumber, status: status.ACTIVE },
      obj
    );

    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    const message = `Use this OTP ${otp} to login to your. theskytrails account`;
    await whatsappAPIUrl.sendMessageWhatsApp(userMobile, message, "hello_test");
    if (!updatedUser) {
      return res.status(statusCode.InternalError).json({
        statusCode: statusCode.InternalError,
        message: responseMessage.INTERNAL_ERROR,
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
      message: responseMessage.LOGIN_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to login====>>>>>", error);
    return next(error);
  }
};
exports.verifyUserOtp = async (req, res, next) => {
  try {
    const { otp, fullName, dob, email } = req.body;
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
        status: updation.status,
        token: token,
      };
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.OTP_VERIFY,
        result: result,
      });
    }
    if (!fullName||!dob) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Forbidden,
        message: responseMessage.FIELD_REQUIRED,
      });
    }
    const updateData = await updateUser(
      { _id: updation._id },
      { username: fullName, dob: dob, email: email, otp: "", firstTime: false }
    );
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
    const message = `Use this OTP ${otp} to login to your. theskytrails account`;
    // await whatsappAPIUrl.sendMessageWhatsApp(userMobile, message);
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
    console.log("result========", result);
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
    const updateUser = await updateUser(
      { _id: isUserExist._id },
      { $set: { otp: otp, otpExpireTime: otpExpireTime } }
    );
    await sendSMS.sendSMSForOtp(mobileNumber, otp);
    const message = `Use this OTP ${otp} to login to your. theskytrails account`;
    // await whatsappAPIUrl.sendWhatsAppMessage(mobileNumber, message);
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
