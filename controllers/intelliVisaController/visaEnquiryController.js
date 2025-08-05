const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AdminNumber = process.env.ADMINNUMBER;
const sendSMSUtils = require("../../utilities/sendSms");
const whatsApi = require("../../utilities/whatsApi");
const commonFunction = require("../../utilities/commonFunctions");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");

/**********************************SERVICES********************************** */
const {
  visaEnquiryServices,
} = require("../../services/intelliVisaServices/visaEnquiryServices");
const {
  createvisaEnquiryList,
  findvisaEnquiry,
  deletevisaEnquiryList,
  visaEnquiryList,
  updatevisaEnquiryList,
  countTotalvisaEnquiryList,
} = visaEnquiryServices;

exports.createVisaEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      visaType,
      country,
      phone,
      whatsapp,
      email,
      terms_accepted,
      source,
    } = req.body;
    // if (whatsapp === true) {
    //    let contactNo;
    //   if (phone.startsWith('+')) {
    //     contactNo = phone;
    //   } else if (phone.startsWith('91') && phone.length >= 12) {
    //     contactNo = '+' + phone;
    //   } else {
    //     contactNo = '+91' + phone;
    //   }
    //   const templates = [
    //         String(firstName),
    //         String(updateResults.pnr),
    //         String(updateResults.airlineDetails[0].Airline.AirlineName),
    //         String(depDate.toLocaleDateString("en-GB", options)),
    //         String(depTime.toLocaleTimeString("en-GB")),
    //         String(arrTime.toLocaleTimeString("en-GB")),
    //         String(updateResults.totalAmount),
    //       ];
    //       await whatsApi.sendWhtsAppOTPAISensy(
    //         "+91" + updateResults.passengerDetails[0].ContactNo,
    //         templates,
    //         "visaEnquiry"
    //       );
    // }
    const result = await createvisaEnquiryList(req.body);
    await commonFunction.visaEnquiryConfirmationMailToUser(result);
    await commonFunction.visaEnquiryConfirmationMailToAdmin(result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getListOfVisaEnquiry=async(req,res,next)=>{
    try {
        const result=await visaEnquiryList({});
         return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
    } catch (error) {
        return next(error);
    }
}