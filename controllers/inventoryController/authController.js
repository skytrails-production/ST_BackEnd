const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");

/**********************************SERVICES********************************** */

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

    const result = await createhotelinventoryAuth(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_SUBMIT_SUCCESSFULL,
    });
  } catch (error) {
    console.log("Error while trying to create user", error);
    return next(error);
  }
};

exports.login=async(req,res,next)=>{
    try {
        const{mobileNumber}=req.body;
        // const otp
        const isUserExist=await findhotelinventoryAuthData({$or:[{phoneNumber:mobileNumber},{email:mobileNumber}]})
        if(!isUserExist){
            return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.PARTNER_NOT_FOUND,
              });
        }

    } catch (error) {
        console.log("error while trying to login",error);
        return next(error);
    }
}