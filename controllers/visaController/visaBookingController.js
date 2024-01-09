const statusCode = require("../../utilities/responceCode");
const responseMessage = require("../../utilities/responses");
const status = require("../../enums/status");
const issuedType = require("../../enums/issuedType");

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
const { visaServices } = require('../../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa,populatedVisaList, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate, getNoVisaByPaginate, montholyVisaListPaginate, onarrivalVisaListPaginate } = visaServices;

exports.visaBooking = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      passportNumber,
      purposeOfVisit,
      travelDates,
      countryID,
      visaType,
      visaCategory,
      documents,
      spouseName,
    } = req.body;
    const { passportImage, image } = req.file;
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
    const isCountryExist=await findWeeklyVisa({_id:countryID._id})
    if (!isCountryExist) {
        return res.status(statusCode.OK).send({
          statusCode: statusCode.OK,
          message: responseMessage.COUNTRY_NOT_FOUND,
        });
      }
    const obj = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      passportNumber: passportNumber,
      purposeOfVisit: purposeOfVisit,
      travelDates: travelDates,
      countryID: isCountryExist._id,
      visaType: visaType,
      visaCategory: visaCategory,
      documents: documents,
      spouseName: spouseName,
    };
    const result = await createvisaBooking(obj);
    // if (passportImage || image) {
    //   const s3Params = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: file.originalname,
    //     Body: file.buffer,
    //     ContentType: file.mimetype,
    //     ACL: "public-read",
    //   };

    //   s3.upload(s3Params, async (err, data) => {
    //     if (err) {
    //       res.status(500).send(err);
    //     } else {
    //       const data1 = new internationl({
    //         ...req.body,
    //         passportImage: passportImage,
    //       });
    //       try {
    //         const response = await data1.save();
    //         msg = "Package is created";
    //         actionCompleteResponse(res, response, msg);
    //       } catch (err) {
    //         sendActionFailedResponse(res, {}, err.message);
    //       }
    //     }
    //   });
    // }
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        message: responseMessage.INTERNAL_ERROR,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.CREATED_SUCCESS, result: result });
  } catch (error) {
    console.log("error while visa booking", error);
    return next(error);
  }
};
