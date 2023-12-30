const VisaEnquiry = require("../model/VisaEnquiry.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

exports.createVisaEnquiry = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contactNo,
    dateOfBirth,
    gender,
    country,
    passportNumber,
    visaCountry,
    visaCategory,
    visaSubcategory,
    visaType,
    package,
    Source,
    reference,
  } = req.body;

  try {
    const response = await VisaEnquiry.create({
      firstName,
      lastName,
      email,
      contactNo,
      dateOfBirth,
      gender,
      country,
      passportNumber,
      visaCountry,
      visaCategory,
      visaSubcategory,
      visaType,
      package,
      Source,
      reference,
    });
    const msg = "VisaEnquiry created successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.getAllVisaEnquiry = async (req, res) => {
  try {
    const response = await VisaEnquiry.find();
    const msg = "VisaEnquiry get successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

// delete particular VisaEnquiry detail with id
exports.deleteVisaEnquiry = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await VisaEnquiry.findByIdAndDelete(id);
    if (!result) {
      const message = "VisaEnquiry not found";
      sendActionFailedResponse(res, {}, message);
    }
    const message = "VisaEnquiry deleted successfully";
    actionCompleteResponse(res, response, message);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
