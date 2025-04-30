
const { SkyTrailsPackageModel } = require("../model/holidayPackage.model");
const CrmAgentPackageEnquiry = require("../model/crmAgentPackageEnquiry.model");

const Notification = require("../model/notification.model");

const sendSMSUtils = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const { sendWhatsAppMessage } = require("../utilities/whatsApi");
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");
const whatsApi = require("../utilities/whatsApi");
const hawaiYatra = require("../utilities/b2bWhatsApp");

const {
  pushNotificationServices,
} = require("../services/pushNotificationServices");
const {
  createPushNotification,
  findPushNotification,
  findPushNotificationData,
  deletePushNotification,
  updatePushNotification,
  countPushNotification,
} = pushNotificationServices;


exports.createCrmAgentPackageEnquiry = async (req, res) => {
  try {
    const {packageId,
      email,
      fullName,
      countryCode,
      phone,
      departureCity,
      adults,
      child,
      packageType,
      departureDate,
      noOfPeople,} =req.body;

      const isPackageExist = await SkyTrailsPackageModel.findOne({ _id: packageId });

      if(!isPackageExist){
        return res.status(statusCode.OK).send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.PACKAGE_NOT_EXIST,
        });
      }
      const addition = Number(adults) + Number(child);
      const object = {
        packageId: isPackageExist._id,
        userId: isUserExist._id,
        email: email,
        fullName: fullName,
        contactNumber: { countryCode: countryCode, phone: phone },
        departureDate: departureDate,
        departureCity: departureCity,
        adults: adults,
        child: child,
        packageType: packageType,
        noOfPeople: addition,
      };
  
    const result = await CrmAgentPackageEnquiry.create(object);


    const notObject = {
      userId: isUserExist._id,
      title: "Holiday package Enquiry",
      description: `New package enquiry for ${isPackageExist.title} on our platform🙂`,
      from: "holidayEnquiry",
      to: fullName,
    };

    await createPushNotification(notObject);
        const contactNo = "+91" + phone;
        const url = `https://theskytrails.com/holidaypackages/packagedetails?packageId=${packageId}`;
        const populatedResult = await CrmAgentPackageEnquiry({ packageId: result._id }).populate('packageId');
        await sendSMS.sendSMSPackageEnquiry(phone, fullName);
        await whatsApi.sendMessageWhatsApp(
          contactNo,
          fullName,
          url,
          "packagetem1_v3"
        );
        await whatsApi.sendWhatsAppMsgAdminPackage(
          AdminNumber,
          isPackageExist.title,
          "adminnotification"
        );
        
        await whatsApi.sendWhatsAppMsgAdmin(AdminNumber, "adminalert");
        await commonFunction.packageBookingConfirmationMail(populatedResult);
    if (result) {
         return res.status(statusCode.OK).send({
           statusCode: statusCode.OK,
           responseMessage: responseMessage.CREATED_SUCCESS,
           result: result,
         });
       }
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};






//getAgentSinglePackageEnquiry

exports.getAgentSinglePackageEnquiry = async (req, res) => {
  try {
    const id=req.query.id;

    const  packageEnquiry = await CrmAgentPackageEnquiry.findById(id);
    
    // console.log(packageEnquiry);
    if (!packageEnquiry) {
      return res.status(404).send({
        statusCode: 404,
        message: "No package enquiry found for this criteria",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Get user package enquiry fetch successfully",
      data: packageEnquiry,
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

//getAgentPackageEnquiryDataWithPagination

exports.getAgentPackageEnquiryDataWithPagination = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 100;
      const sorted = { createdAt: -1 };
      const query = {
        userId : req.query.userId
      };
  
      const packagedata = await exports.AgentPackageEnquiryServicesWithPagination(
        page,
        limit,
        sorted,
        query
      );
  
      // console.log(user);
      if (packagedata.data.length === 0) {
        return res.status(404).send({
          statusCode: 404,
          message: "No package enquiry found for this criteria",
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        message: "Get all user package enquiry fetch successfully",
        meta: packagedata.meta,
        data: packagedata.data,
      });
    } catch (err) {
      const errorMsg = err.message || "Unknown error";
      res.status(500).send({ statusCode: 500, message: errorMsg });
    }
  };

// AgentPackageEnquiryServicesWithPagination
exports.AgentPackageEnquiryServicesWithPagination = async (page, limit, sorted, query) => {
    try {
      const skip = (page - 1) * limit;
  
      const [data, total] = await Promise.all([
        CrmAgentPackageEnquiry.find(query)
          .sort(sorted)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .lean().select("-__v").populate('packageId'),
  
          CrmAgentPackageEnquiry.countDocuments(query),
      ]);
  
      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      // Create the pagination object
      const meta = {
        page,
        limit,
        totalPages,
        totalRecords: total,
      };
      return { data, meta };
    } catch (error) {
      throw new Error(error.message);
    }
  };