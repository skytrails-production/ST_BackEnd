const statusCode = require("../../utilities/responceCode");
const responseMessage = require("../../utilities/responses");
const status = require("../../enums/status");
const issuedType = require("../../enums/issuedType");
const commonFunctions = require("../../utilities/commonFunctions");
const sendSMS = require("../../utilities/sendSms");
const whatsApi=require("../../utilities/whatsApi")
//********************************************SERVICES*******************************************/
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const {
  visaBookingServices,
} = require("../../services/visaAppServices/visaBookingSchema");
const {
  createvisaBooking,
  findVisaBookingData,
  deleteVisaBooking,
  visaBookingList,
  updateVisaBooking,
  countTotalVisaBooking,
  getVisaBooking,
} = visaBookingServices;
const { visaServices } = require("../../services/visaServices");
const {
  createWeeklyVisa,
  findWeeklyVisaPopulate,
  findWeeklyVisa,
  populatedVisaList,
  deleteWeeklyVisa,
  weeklyVisaList,
  updateWeeklyVisa,
  weeklyVisaListPaginate,
  getNoVisaByPaginate,
  montholyVisaListPaginate,
  onarrivalVisaListPaginate,
} = visaServices;


exports.visaBooking = async (req, res, next) => {
  try {
    const {firstName,lastName,phoneNumber,email,dateOfBirth,passportNumber,purposeOfVisit,travelDates,countryID,documents,spouseName,} = req.body;
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
    if (req.files.passportImage) {
      req.files.passportImage= await commonFunctions.getSecureUrlAWS(req.files.passportImage);
    }
    if (req.files.image) {
      req.files.image = await commonFunctions.getSecureUrlAWS(req.files.image);
    }
    const isCountryExist = await findWeeklyVisaPopulate({ _id: countryID, status:status.ACTIVE });
    if (!isCountryExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.COUNTRY_NOT_FOUND,
      });
    }
    const obj = {
      userId:isUserExist._id,
      firstName: firstName,
      lastName: lastName,
      phoneNumber:phoneNumber,
      email:email,
      dateOfBirth: dateOfBirth,
      image: req.files.image,
      passportImage: req.files.passportImage,
      passportNumber: passportNumber,
      purposeOfVisit: purposeOfVisit,
      travelDates: travelDates,
      countryID: isCountryExist._id,
      visaType: isCountryExist.visaType,
      visaCategory: isCountryExist.visaCategoryId.categoryName,
      documents: documents,
      spouseName: spouseName,
    };
    const result = await createvisaBooking(obj);
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    const msg=`Dear ${firstName + lastName},
    Thank you for booking your visa with us. We have received your request and partial payment.Further processing is required, and we will keep you informed about the progress.
    Please make sure to keep all required documents ready for the visa application process.
    If you have any questions, please feel free to reach out to our customer support team.
    Best regards,
    TheSkyTrails pvt ltd 
    `;
    // await sendSMS.sendSMSForHotelBooking(result);
      // await whatsApi.sendWhatsAppMessage(phoneNumber,msg);
      await commonFunctions.VisaApplyConfirmationMail(result)
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.CREATED_SUCCESS, result: result });
  } catch (error) {
    console.log("error while visa booking", error);
    return next(error);
  }
};
