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
const path = require('path');
/**********************************SERVICES********************************** */
const {
  pushNotificationServices,
} = require("../../services/pushNotificationServices");
const {
  createPushNotification,
  findPushNotification,
  findPushNotificationData,
  deletePushNotification,
  updatePushNotification,
  countPushNotification,
} = pushNotificationServices;
const {
  pushNotification,
  mediapushNotification,
  pushSimpleNotification,
  pushNotification1,
  pushNotificationAfterDepricate,
} = require("../../utilities/commonFunForPushNotification");
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
  visaCountryServices,
} = require("../../services/intelliVisaServices/visaCountryService");
const {
  createCountryList,
  findCountry,
  deleteCountryList,
  countryList,
  updatecountryList,
  countTotalcountryList,
} = visaCountryServices;
const {
  visaBookingServices,
} = require("../../services/intelliVisaServices/applyAiVisaServices");
const {
  createvisaBooking,
  findVisaBooking,
  findOneVisaBookingPop,
  deleteVisaBooking,
  visaBookingList,
  visaBookingListPop,
  updateVisaBooking,
  countTotalVisaBooking,
} = visaBookingServices;
const {
  aiVisaApplicationServices,
} = require("../../services/intelliVisaServices/aiVisaApplicationServices");
const {
  createAiVisaApplication,
  findAiVisaApplication,
  deleteAiVisaApplication,
  updateAiVisaApplication,
  countTotalAiVisaApplication,
} = aiVisaApplicationServices;
exports.visaApplicationsReg = async (req, res, next) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      sex,
      mobileNumber,
      address,
      depCountyName,
      arrCountyName,
      fromDate,
      toDate,
      visaType,
      fee,applicantUid,
      bearerToken,
      visaCategory,
      sourceCountry,
      destinationCountry,
      applicationCreationKey,
      agentName,
      agentId,
      contactNumber,
    } = req.body;
    const object = {
      userId,
      firstName,
      lastName,
      email,
      sex,
      mobileNumber,
      address,
      depCountyName,
      arrCountyName,
      fromDate,
      toDate,
      visaType,
      fee,
      sessionCredential: {
        applicantUid,
        bearerToken,
        visaCategory,
        fromDate,
        toDate,
        sourceCountry,
        destinationCountry,
        applicationCreationKey,
      },
      agentDetails:{
        agentName,
        agentId,
        contactNumber,
      }
    };
    const result = await createvisaBooking(object);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.getVisaApplications = async (req, res, next) => {
  try {
    const result = await visaBookingList();
    if (result.length < 1) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
          result: result,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    return next(error);
  }
};

exports.getVisaApplicationByUser = async (req, res, next) => {
  try {
    const result = await visaBookingList({ userId: req.query.userId });
    if (result.length < 1) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
          result: result,
        });
    }
    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    return next(error);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const {
      applicantUid,
      bearerToken,
      visaCategory,
      fromDate,
      toDate,
      sourceCountry,
      destinationCountry,
      applicationCreationKey,
      agentName,
      agentId,
      contactNumber,
      userId,
      email,
    } = req.body;
    const object = {
      sessionCredential: {
        applicantUid,
        bearerToken,
        visaCategory,
        fromDate,
        toDate,
        sourceCountry,
        destinationCountry,
        applicationCreationKey,
      },
      agentDetails:{
        agentName,
        agentId,
        contactNumber,
      }
    };
    const isUserExist = await findVisaBooking({ userId: userId, email: email });
    if (!isUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({ responseMessage: responseMessage.APPLICATION_NOT_FOUND });
    }
    const updateUserData = await updateVisaBooking(
      { _id: isUserExist._id },
      object
    );
    console.log("updatedUser===", updateUserData);
    return res
      .status(statusCode.OK)
      .send({
        responseMessage: responseMessage.DATA_FOUND,
        result: updateUserData,
      });
  } catch (error) {
    return next(error);
  }
};


exports.saveAIVisaApplData = async (req, res, next) => {
  try {
    const {
      applicantName,
      passportNumber,
      visaType,
      visaCategory,
      destinationCountry,
      travelDates,
      durationDays,
      appointmentDetails,
      tracking,
      passportCollection,
      applicantEmail,
      userId
    } = req.body;

    let documents = [];

    if (req.files) {
      for (const imageData of req.files) {
        const imageUrl = await commonFunction.getImageUrlAWSByFolderSingle(imageData, "aiVisaDocs");
        const fileNameWithoutExt = path.parse(imageData.originalname).name;
        documents.push({ name: fileNameWithoutExt, url: imageUrl });
      }
    }
    const applicationData = {
      applicantName,
      passportNumber,
      visaType,
      visaCategory,
      destinationCountry,
      travelDates,
      durationDays,
      appointmentDetails: JSON.parse(appointmentDetails),
      tracking: JSON.parse(tracking),
      passportCollection: JSON.parse(passportCollection),
      applicantEmail,
      userId,
      documents
    };

    let result;
    const isApplicationExist = await findAiVisaApplication({ applicantEmail, userId });

    if (isApplicationExist) {
      result = await updateAiVisaApplication(applicationData);
    } else {
      result = await createAiVisaApplication(applicationData);
    }

    return res.status(statusCode.OK).send({
      responseMessage: responseMessage.DATA_FOUND,
      result
    });

  } catch (error) {
    console.error("Error while trying to save data", error);
    return next(error);
  }
};
