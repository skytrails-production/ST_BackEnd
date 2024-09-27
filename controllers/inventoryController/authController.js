const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const refeerralCode = commonFunction.generateReferralCode();
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

/**********************************SERVICES********************************** */
const approveStatus = require("../../enums/approveStatus");


const {
  hotelinventoryAuthServices,
} = require("../../services/inventory/partnerAuthServices");
const {
  createhotelinventoryAuth,
  findhotelinventoryAuthData,
  deletehotelinventoryAuth,
  hotelinventoryAuthList,
  updatehotelinventoryAuth,
  countTotalhotelinventoryAuth,
  gethotelinventoryAuth,
} = hotelinventoryAuthServices;

exports.signUp = async (req, res, next) => {
  try {
    const {
      hotelName,
      propertyType,
      channelMngrName,
      hotelCity,
      managerName,
      email,
      phoneNumber,
    } = req.body;
   
    // Ensure email is in lowercase and trimmed
    req.body.email = req.body.email.trim().toLowerCase();
    req.body.managerName=req.body.managerName.trim();
    req.body.hotelName=req.body.hotelName.trim()
    // Generate partner ID and password
    req.body.partnerId = commonFunction.generateReferralCode();
    const password = `${managerName}@1234`;
    req.body.password = await bcrypt.hashSync(password, 10);

// Check if the email or phone number already exists
const isAlreadyExist = await findhotelinventoryAuthData({
  $or: [{ email: req.body.email }, { phoneNumber: phoneNumber }],
});

if (isAlreadyExist) {
  return res.status(statusCode.OK).send({
    statusCode: statusCode.Conflict,
    responseMessage: responseMessage.REQUEST_ALREADY_EXIST,
  });
}

// Create new hotel inventory auth data
const result = await createhotelinventoryAuth(req.body);

return res.status(statusCode.OK).send({
  statusCode: statusCode.OK,
  responseMessage: responseMessage.DATA_SUBMIT_SUCCESSFULL,
  result: result,
});
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    var isUserExist = await findhotelinventoryAuthData({
      email: email,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    if (isUserExist.approveStatus === approveStatus.PENDING) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Unauthorized,
        responseMessage: responseMessage.UNAUTHORIZED,
      });
    } else if (isUserExist.approveStatus === approveStatus.REJECT) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Unauthorized,
        responseMessage: responseMessage.REJECTED_ACCOUNT,
      });
    }
    const isMatchPass = await bcrypt.compareSync(
      password,
      isUserExist.password
    );
    if (!isMatchPass) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.Unauthorized,
        responseMessage: responseMessage.INCORRECT_LOGIN,
      });
    }
    const token = await commonFunction.getToken({
      _id: isUserExist._id,
      email: isUserExist.email,
      phoneNumber: isUserExist.phoneNumber,
    });
    const result = {
      _id: isUserExist._id,
      email: isUserExist.email,
      phoneNumber: isUserExist.phoneNumber,
      partnerId:isUserExist.partnerId,
      managerName:isUserExist.managerName,
      hotelCity:isUserExist.hotelCity,
      channelMngrName:isUserExist.channelMngrName,
      hotelName:isUserExist.hotelName,
      propertyType:isUserExist.propertyType,
      approveStatus:isUserExist.approveStatus,
      token: token,
      hotelCity:isUserExist.hotelCity
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.LOGIN_SUCCESSFULLY,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    var isUserExist = await findhotelinventoryAuthData({
      email: email,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const token = await commonFunction.getResetToken({
      _id: isUserExist._id,
      email: isUserExist.email,
      contactNumber: isUserExist.contactNumber,
      userType: isUserExist.userType,
    });
    const sentMail = await commonFunction.sendResetPassMailInvetoryPartner(email, token);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      // responseMessage: responseMessage.EMAIL_SENT,
      result: token,
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confrmPassword } = req.body;
    const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    if (password !== confrmPassword) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.PASSWORD_NOT_MATCH,
      });
    }
    const hashedPass = await bcrypt.hashSync(password, 10);
    await updatehotelinventoryAuth(
      { _id: isUserExist._id },
      { password: hashedPass }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPartnerList = async (req, res, next) => {
  try {
    const result = await hotelinventoryAuthList({ status: status.ACTIVE });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getPartnerById = async (req, res, next) => {
  try {
    const result = await findhotelinventoryAuthData({
      _id: req.query.partnerId,
      status: status.ACTIVE,
    });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { profilePic, bio } = req.body;
    const isUserExist = await findhotelinventoryAuthData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    if (req.file) {
      req.body.profilePic = await commonFunction.getImageUrlAWS(req.file);
    }
  } catch (error) {
    return next(error);
  }
};

exports.deletePartner = async (req, res, next) => {
  try {
    const isUserExist = await findhotelinventoryAuthData({
      _id: partnerId,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const deleteUserAcount = await deletehotelinventoryAuth({
      _id: isUserExist._id,
    });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result: deleteUserAcount,
    });
  } catch (error) {}
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const isUserExist = await findhotelinventoryAuthData({
      _id: req.userId,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const deleteUserAcount = await updatehotelinventoryAuth(
      {
        _id: isUserExist._id,
      },
      { status: status.DELETE }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result: deleteUserAcount,
    });
  } catch (error) {
    return next(error);
  }
};

exports.partnerdashboard=async(req,res,next)=>{
  try {
    const isUserExist = await findhotelinventoryAuthData({
      _id: req.userId,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const partnerHotelCount=await countTotalhotelinventoryAuth({partnerId:isUserExist._id,status:status.ACTIVE});
    
  } catch (error) {
    return next(error);
  }
}

exports.changePassword=async(req,res,next)=>{
  try {
    const {oldPassword, password, confrmPassword } = req.body;
    const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const isCorrect=await bcrypt.compareSync(oldPassword,isUserExist.password);
    if(!isCorrect){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.INCORRECT_PASS,
      });
    }
    if (password !== confrmPassword) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.PASSWORD_NOT_MATCH,
      });
    }
    const hashedPass = await bcrypt.hashSync(password, 10);
    await updatehotelinventoryAuth(
      { _id: isUserExist._id },
      { password: hashedPass }
    );
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.PASSWORD_CHANGED,
    });
  } catch (error) {
    return next(error);
  }
}




