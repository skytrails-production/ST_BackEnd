const db = require("../model");
const b2bUser = db.userb2b;
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const wallet = require("../model/wallet.model");
const agentWallets = require("../model/agentWallet.model");
const randomPayments= require("../model/randomPayment.model");
const User = require("../model/user.model");
const Role = require("../model/role.model");
const crypto = require("crypto");
const axios = require("axios");
const sectors = require("../model/addSectorModal");
const fixdepartures = require("../model/addFixDepartureData");
const fixdeparturebookings = require("../model/addFixDepartureBooking");
const Razorpay = require("razorpay");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const fs = require("fs");
const csv = require("csv-parser");
const { Readable } = require("stream");
const { userInfo } = require("os");
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const bookingStatus = require("../enums/bookingStatus");
const sendSMS = require("../utilities/sendSms");
const whatsappAPIUrl = require("../utilities/whatsApi");
const ObjectId = mongoose.Types.ObjectId;
const userType = require("../enums/userType");
const status = require("../enums/status");
//***************************************************************************SERVICES******************************************************************/
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const {
  aggregatePaginateHotelBookingList,
  findhotelBooking,
  findhotelBookingData,
  deletehotelBooking,
  updatehotelBooking,
  hotelBookingList,
  countAgentTotalBooking,
  aggregatePaginateHotelBookingList1,
  aggregatePaginateHotelBookings,
} = hotelBookingServicess;
const { brbuserServices } = require("../services/btobagentServices");
const {
  createbrbuser,
  findbrbuser,
  getbrbuser,
  findbrbuserData,
  updatebrbuser,
  deletebrbuser,
  brbuserList,
  brbAgentList,
  paginatebrbuserSearch,
  countTotalbrbUser,
} = brbuserServices;
const { visaServices } = require("../services/visaServices");
const {
  createWeeklyVisa,
  findWeeklyVisa,
  deleteWeeklyVisa,
  weeklyVisaList,
  updateWeeklyVisa,
  weeklyVisaListPaginate,
} = visaServices;
const { changeRequestServices } = require("../services/changeRequest");
const {
  createchangeRequest,
  findchangeRequest,
  findchangeRequestData,
  deletechangeRequest,
  changeRequestList,
  updatechangeRequest,
  paginatechangeRequestSearch,
  aggregatePaginatechangeRequestList,
  countTotalchangeRequest,
} = changeRequestServices;
const {
  changeHotelRequestServices,
} = require("../services/changeHotelRequestServices");
const {
  createchangeHotelRequest,
  findchangeHotelRequest,
  getchangeHotelRequest,
  deletechangeHotelRequest,
  changeHotelRequestList,
  updatechangeHotelRequest,
  paginatechangeHotelRequestSearch,
  aggregatePaginatechangeHotelRequestList,
  countTotalchangeHotelRequest,
} = changeHotelRequestServices;
const { changeBusRequestServices } = require("../services/changeBusRequest");
const {
  createchangeBusRequest,
  findchangeBusRequest,
  getchangeBusRequest,
  deletechangeBusRequest,
  changeBusRequestList,
  updatechangeBusRequest,
  paginatechangeBusRequestSearch,
  aggregatePaginatechangeBusRequestList,
  countTotalchangeBusRequest,
} = changeBusRequestServices;
const {agentStaticContentServices}=require('../services/agentStaticServices');
const {createAgentStaticContent,findAgentStaticContent,findAgentStaticContentData,deleteAgentStaticContentStatic,updateAgentStaticContentStatic}=agentStaticContentServices;
//**********Necessary models***********/
const flightModel = require("../model/flightBookingData.model");
const hotelBookingModel = require("../model/hotelBooking.model");
const busBookingModel = require("../model/busBookingData.model");
const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const { log } = require("console");
const { internationl } = require("../model/international.model");
const { logger, sendMail } = require("../config/nodeConfig");
const agentWalletHistory=require("../model/agentWalletHistory");
const e = require("cors");
// console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

// Set up AWS S3 client
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

exports.RegisterUser = async (req, res) => {
  // Upload image to S3
  const reqData = JSON.parse(req.body.data);
  // const isExistAgent=await User.findOne({"personal_details?.email":reqData?.personal_details?.email.toLowerCase()});
  // if(isExistAgent){
  //   return res.status(501).send({message:"Email already exists"});
  // }
  const file = req?.file;
  var salt = bcrypt.genSaltSync(10);
  // console.log(reqData.password);
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `agentImages/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  if(reqData.referralCode){
    const isCodeValid=await b2bUser.findOne({referralCode:req.params.referralCode});
  if(!isCodeValid){
    return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage:responseMessage.REFERRALCODE_NOT_EXIST });
  }
  }
  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Save user to database
      const user = new b2bUser({
        personal_details: {
          ...reqData.personal_details,
          email:reqData?.personal_details?.email.toLowerCase(),
          first_name:reqData?.personal_details?.first_name.trim(),
          last_name:reqData?.personal_details?.last_name.trim(),         
          mobile: {
            country_code: "+91",
            mobile_number: reqData.personal_details.mobile.mobile_number,
          },
          password: bcrypt.hashSync(reqData.personal_details.password, salt),
        },
        agency_details: {
          ...reqData.agency_details,
          agency_mobile: {
            country_code: "+91",
            mobile_number: reqData.agency_details.agency_mobile.mobile_number,
          },
          document_details: {
            pan_card_document: data.Location,
          },
        },
        agency_gst_details: {
          ...reqData.agency_gst_details,
        },
        referrerCode:reqData.referralCode
      });

      try {
        var size = Object.keys(user).length;
        if (size > 0) {
          const walletdata = await wallet.create({
            userId: user._id.toString(),
            currency: reqData.currency,
            status: "successful",
          });
          user.walletid = walletdata._id.toString();
        }
        const response = await user.save();
        msg = "Data Saved Successfully";
        await sendSMS.sendSMSAgents(response.personal_details.mobile.mobile_number, response.personal_details.email);
        // const msg = `Welcome to TheSkyTrails, Admin added you as an agent. Please use the following credentials to login and fill in the mandatory form:\nEmail: ${email}, and Password: ${password} .click here: ${process.env.AGENT_URL}`;
        // await whatsappAPIUrl.sendWhatsAppMessage(mobile_number, msg);
        // await whatsappAPIUrl.sendMessageWhatsApp(number,to,email,pass,temName)
        await commonFunction.sendAgent(response.personal_details.email, reqData.personal_details.password);
        actionCompleteResponse(res, response, msg);
      
      } catch (err) {
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

exports.uploadAgentLogo = async (req, res) => {
  const userId = req.body.userId; // Assuming userId is sent in the request body

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Check if logo file exists in the request
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    
    const agent = await b2bUser.findOne({_id: userId }); 
    if (!agent) {
      return res.status(401).json({ error: 'You are not authorized to upload a logo' });
    }

    // If authorized, proceed with logo upload
    const file = req.file;
  
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `agentImages/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    // Upload logo image to S3
    s3.upload(s3Params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        try {
         const response= await b2bUser.findOneAndUpdate(
            { _id:userId }, 
            { $set: { agentCompanyLogo: data.Location } }, 
            { new: true }
          );

          res.json({ success: true, message: 'Logo uploaded successfully' });
        } catch (err) {
          res.status(500).send('Error updating logo URL in the database');
        }
      }
    });
  } catch (err) {
    res.status(500).send('Error checking user authorization');
  }
};

exports.LoginUser = async (req, res) => {
  try {
    const user = await b2bUser.findOne({
      "personal_details.email": req.body.email.toLowerCase(),
    });

    if (!user) {
      const msg = "User Not found.";
      return sendActionFailedResponse(res, {}, msg);
    }

    if (user.is_active === 0) {
      const msg = "User Disabled. Please Contact your Administrator";
      return sendActionFailedResponse(res, {}, msg);
    } else if (user.is_active === 1) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user?.personal_details?.password
      );

      if (!passwordIsValid) {
        const msg = "Invalid Password!";
        return sendActionFailedResponse(res, {}, msg);
      }

      const response = {
        id: user._id,
        username: user?.personal_details?.first_name,
        email: user?.personal_details?.email,
        balance: user?.balance,
        markup: user?.markup,
      };
      const msg = "User Login Successfully!";
      return actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};

exports.UserUpdate = async (req, res) => {
  try {
    let { user_id, is_active } = req.body;
    let findCri = {
      _id: user_id,
    };
    let updateCri = {
      is_active: is_active,
      approveStatus:status.ACTIVE,
      isApproved:true
    };

    await b2bUser.findOneAndUpdate(findCri, updateCri, { new: true });
    msg = "Status has been updated successfully";
    let resData = {
      updateCri,
    };
    actionCompleteResponse(res, resData, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(req.body.isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const response = await b2bUser.findByIdAndDelete(userId);
      // console.log(response.walletid.toString());
      await wallet.findByIdAndDelete(response.walletid.toString());
      const msg = "user deleted successfully";
      actionCompleteResponse(res, {}, msg);
    } else {
      const msg = "only Admin can delete b2b users ";
      actionCompleteResponse(res, {}, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.Getallusers = async (req, res) => {
  try {
    const users = await b2bUser.find();
    msg = "User Fetched";
    actionCompleteResponse(res, users, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.SetMarkup = async (req, res) => {
  try {
    const { userId } = req.body; //destructure userId and amount from request body
    //check if userId is valid in table
    const resData = await b2bUser.findById(userId);
    // console.log(resData);
    const user = await b2bUser.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          markup: {
            bus: req.body.markup.bus || resData.markup.bus,
            hotel: req.body.markup.hotel || resData.markup.hotel,
            flight: req.body.markup.flight || resData.markup.flight,
            holiday: req.body.markup.holiday || resData.markup.holiday,
          },
        },
      },
      { new: true }
    );
    if (!user) {
      msg = "Invalid userId";
      sendActionFailedResponse(res, {}, msg);
    }
    msg = "Amount updated successfully";
    actionCompleteResponse(res, user, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.GetMarkup = async (req, res) => {
  try {
    const { userId } = req.params; //destructure userId from request params
    const user = await b2bUser.findOne({ _id: userId }, "markup");
    if (!user) {
      sendActionFailedResponse(res, {}, "Invalid userId");
    } else {
      actionCompleteResponse(res, user, "Markup amount retrieved successfully");
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};


exports.payVerify = (req, res) => {
  try {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    // console.log("sig" + req.body.razorpay_signature);
    // console.log("sig" + expectedSignature);

    if (expectedSignature === req.body.razorpay_signature) {
      console.log("Payment Success");
    } else {
      console.log("Payment Fail");
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    // console.log(error.message);
  }
};

// get userById

exports.UserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Query MongoDB to find a user by userId
    const user = await b2bUser
      .findById(userId)
      .select("-personal_details.password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    actionCompleteResponse(res, user, "User Found");
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};

//change password

exports.UserChangePassword = async (req, res) => {
  try {
    const { _id, oldpassword, changepassword, confirmpassword } = req.body;
    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "User not found");
    }

    // Check if the old password matches the stored password
    const isPasswordValid = await bcrypt.compare(
      oldpassword,
      user.personal_details.password
    );

    if (!isPasswordValid) {
      return sendActionFailedResponse(res, {}, "Old password is incorrect");
    }

    // Check if the new password and confirmation match
    if (changepassword !== confirmpassword) {
      return sendActionFailedResponse(
        res,
        {},
        "New password and confirmation do not match"
      );
    }

    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(changepassword, 10); // You can adjust the salt rounds as needed

    // Update the user's password field (assuming it's under personal_details)
    user.personal_details.password = hashedPassword;
    const updaeUser = await user.save();

    // Send a success response
    return actionCompleteResponse(res, updaeUser, {
      message: "Password updated successfully",
    });
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};

exports.agentQues = async (req, res, next) => {
  try {
    // const{userId}=req.userId;
    // const {userId}=req.body;
    const { page, limit, search, userId } = req.query;
    const isUSerExist = await findbrbuser({ _id: userId });
    if (!isUSerExist) {
      return res
        .status(statusCode.NotFound)
        .send(responseMessage.AGENT_NOT_FOUND);
    }
    const hotelData = await aggregatePaginateHotelBookingList(req.query);
    // console.log("hotelData============", busBookData);
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "userDetails.username": 1,
          "userDetails.email": 1,
          "userDetails.userType": 1,
          flightName: 1,
          paymentStatus: 1,
          pnr: 1,
          transactionId: 1,
          transactionId: 1,
          country: 1,
          city: 1,
          address: 1,
          gender: 1,
          firstName: 1,
          lastName: 1,
          userId: 1,
          _id: 1,
          phone: 1,
        },
      },
      {
        $match: {
          $or: [
            { flightName: { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: parseInt(data) },
          ],
        },
      },
    ];
    let aggregate = flightModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
    };
    const flightData = await flightModel.aggregatePaginate(aggregate, options);
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { destination: { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: { $regex: data, $options: "i" } },
            { origin: { $regex: data, $options: "i" } },
            { dateOfJourney: { $regex: data, $options: "i" } },
            { busType: { $regex: data, $options: "i" } },
            { busId: parseInt(data) },
            { name: { $regex: data, $options: "i" } },
            { bookingStatus: { $regex: data, $options: "i" } },
          ],
        },
      },
    ];
    // console.log("flightData=========", flightData);
    let aggregate1 = busBookingModel.aggregate(pipeline);
    const options1 = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
    };
    const busBookData = await busBookingModel.aggregatePaginate(
      aggregate1,
      options1
    );
    const combinedData = [hotelData, flightData, busBookData];
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: combinedData });
  } catch (error) {
    return next(error);
  }
};

//subtract Balance

exports.subtractBalance = async (req, res) => {
  try {
    const { _id, amount ,bookingType} = req.body;

    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "Invalid userId");
    }
    // Update the user's balance by subtracting balance
    user.balance -= Number(amount);

    // Save the updated user
    const updatedUser = await user.save();
    const obj={
      agnetId:_id,
      amount:amount,
      bookingType:bookingType
    }
    const wallethistory=await agentWalletHistory.create(obj);
    // Respond with the updated user object
    actionCompleteResponse(
      res,
      updatedUser,
      "User balance updated successfully"
    );
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};

//************GET ALL HOTEL BOOKING LIST ***************/

exports.getAllAgentHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate, userId } = req.query;
    const isAgent = await findbrbuser({ _id: userId });
    // console.log(isAgent,"agent found");
    if (!isAgent) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { hotelName: { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: { $regex: data, $options: "i" } },
            { bookingId: parseInt(data) },
          ],
        },
      },
    ];
    let aggregate = hotelBookingModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await hotelBookingModel.aggregatePaginate(
      aggregate,
      options
    );
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      message: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

//**************GET ALL FLIGHT BOOKING LIST*************/

exports.getAllAgentFlightBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, userId } = req.query;
    const isAgent = await findbrbuser({ _id: userId });
    if (!isAgent) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USERS_NOT_FOUND });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { flightName: { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: { $regex: data, $options: "i" } },
            { bookingId: parseInt(data) },
          ],
        },
      },
    ];
    let aggregate = flightModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await flightModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res
        .status(statusCode.OK)
        .send({statusCode:statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

//************GETALL BUSBOKING DETAILS****************/

exports.getAllAgentBusBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid userId" });
    }

    const isAgent = await findbrbuser({ _id: userId });
    if (!isAgent) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USERS_NOT_FOUND });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { destination: { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: { $regex: data, $options: "i" } },
            { origin: { $regex: data, $options: "i" } },
            { dateOfJourney: { $regex: data, $options: "i" } },
            { busType: { $regex: data, $options: "i" } },
            { busId: parseInt(data) },
            { name: { $regex: data, $options: "i" } },
            { bookingStatus: { $regex: data, $options: "i" } },
          ],
        },
      },
    ];
    let aggregate = busBookingModel.aggregate(pipeline);
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
    };
    const result = await busBookingModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res
        .status(statusCode.OK)
        .send({statusCode:statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

//**************CANCEL BOOKINGS BY AGENT****************/

exports.cancelBookingByAgent = async (req, res, next) => {
  try {
    const {} = req.body;
  } catch (error) {
    return next(error);
  }
};

//change hotel booking details request by agent **********************

exports.changeHotelDetailsRequest = async (req, res, next) => {
  try {
    const {
      reason,
      changerequest,
      bookingId,
      id,
      agentId,
      contactNumber,
      amount,
    } = req.body;
    const isAgentExists = await findbrbuser({ _id: agentId });
    if (!isAgentExists) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const isBookingExist = await findhotelBooking({
      userId: isAgentExists._id,
      bookingId: bookingId,
      status: status.ACTIVE,
    });
    if (!isBookingExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const object = {
      reason: reason,
      changerequest: changerequest,
      bookingId: bookingId,
      hotelBookingId: id,
      agentId: agentId,
      contactNumber: contactNumber,
      amount: amount,
    };
    const result = await createchangeHotelRequest(object);
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    return next(error);
  }
};

//change flight booking details request by agent **********************

exports.changeFlightDetailsRequest = async (req, res, next) => {
  try {
    const {
      reason,
      changerequest,
      bookingId,
      id,
      agentId,
      contactNumber,
      amount,
    } = req.body;
    const isAgentExists = await findbrbuser({ _id: agentId });
    if (!isAgentExists) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const isBookingExist = await flightModel.findOne({
      userId: isAgentExists._id,
      bookingId: bookingId,
      status: status.ACTIVE,
    });
    if (!isBookingExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const object = {
      reason: reason,
      changerequest: changerequest,
      bookingId: bookingId,
      flightBookingId: id,
      agentId: agentId,
      contactNumber: contactNumber,
      amount: amount,
    };
    const result = await createchangeRequest(object);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CHANGE_REQUEST_SUCCESS,
      result: result,
    });
  } catch (error) {
    return next(error);
  }
};

//change bus booking details request by agent **********************
exports.changeBusBookingDetailsRequest = async (req, res, next) => {
  try {
    const {
      reason,
      changerequest,
      busId,
      id,
      agentId,
      contactNumber,
      amount,
    } = req.body;
    const isUSerExists = await findbrbuser({ _id: agentId });
    if (!isUSerExists) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.AGENT_NOT_FOUND,
      });
    }
    const isBookingExist = await busBookingModel.findOne({
      userId: isUSerExists._id,
      busId: busId,
      status: status.ACTIVE,
    });
    if (!isBookingExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    const object = {
      reason: reason,
      changerequest: changerequest,
      bookingId: busId,
      busBookingId: id,
      agentId: agentId,
      contactNumber: contactNumber,
      amount: amount,
    };
    const result = await createchangeBusRequest(object);
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    return next(error);
  }
};

//get change flight booking details request by agent**********************************
exports.getchangeFlightRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = aggregatePaginatechangeRequestList(req.query);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    return next(error);
  }
};

//==========================================================================
// ===== fix departure controllers admin ==============
//==========================================================================

//get change hotel booking details request by agent**********************************
exports.getchangeHotelRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = aggregatePaginatechangeHotelRequestList(req.query);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    return next(error);
  }
};
//get change bus booking details request by agent**********************************
exports.getchangeBusRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = aggregatePaginatechangeBusRequestList(req.query);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.BOOKING_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.addSector = async (req, res) => {
  try {
    const { Sector } = req.body;
    // console.log(Sector);
    const oldSector = await sectors.findOne({ Sector: Sector });
    if (oldSector) {
      res.status(400).send({ status: "failed", error: "Sector already exits" });
    } else {
      const newSector = new sectors({
        Sector: Sector,
      });
      let result = await newSector.save();
      res.status(201).send({ status: "success", data: result });
    }
  } catch (error) {
    console.log(error);
  }
};

// get Sector

exports.getSector = async (req, res) => {
  try {
    const sectorData = await sectors.find({});
    res.status(200).send({ data: sectorData });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

exports.fixDeparturedata = async (req, res) => {
  try {
    const data = { ...req.body };
    // console.log(data,"body data")
    let result = await fixdepartures.create(data);
    res.status(201).send({ status: "success", data: result });
  } catch (error) {
    console.log(error);
  }
};

//update fixDepartureData
exports.updateFixDepartureData = async (req, res) => {
  try {
    const { _id, noOfBooking } = req.body; // Assuming _id and AvailableSeats are sent in the request body

    // Check if _id or AvailableSeats is missing in the request
    if (!_id || !noOfBooking) {
      return res.status(400).send({
        status: "error",
        message: "Missing _id or AvailableSeats in request body",
      });
    }

    // Assuming fixdepartures is the model for your database collection
    const departure = await fixdepartures.findById(_id);

    if (!departure) {
      return res
        .status(404)
        .send({ status: "error", message: "Departure not found" });
    }

    if (departure.AvailableSeats < noOfBooking) {
      return res.status(400).send({
        status: "error",
        message: "Requested seats exceed available seats",
      });
    }

    const updatedAvailableSeats = departure.AvailableSeats - noOfBooking;

    const updatedDeparture = await fixdepartures.findByIdAndUpdate(
      _id,
      { $set: { AvailableSeats: updatedAvailableSeats } }, // Update the AvailableSeats field with the updated value
      { new: true }
    );

    if (!updatedDeparture) {
      return res
        .status(404)
        .send({ status: "error", message: "Failed to update departure" });
    }

    res.status(200).send({ status: "success", data: updatedDeparture });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};

exports.fixDeparturefilter = async (req, res) => {
  try {
    const Sector = req.query.Sector;
    if (Sector === "All") {
      // console.log(Sector,"ALLLLLLLLLL");
      const filteredAllFlights = await fixdepartures.find({});
      res.status(200).send({ status: "success", data: filteredAllFlights });
    } else {
      if (!Sector) {
        return res.status(400).json({ error: "Sector parameter is missing." });
      }
      // console.log("data",Sector);

      const filteredFlights = await fixdepartures.find({ Sector: Sector });
      // console.log(filteredFlights.length, "array lengh");
      if (filteredFlights.length != 0) {
        res.status(200).send({ status: "success", data: filteredFlights });
      } else {
        res.status(404).send({ status: "Error", data: "Data Not Found" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

//add fixdepartureBooking Details

exports.fixDepartureBooking = async (req, res) => {
  try {
    const names = req.body.names.map((name, index) => {
      // Convert index to string as keys in Map are strings
      return name;
    });
    const data = {
      ...req.body,
      // passengerDetails: new Map(passengers),
      names: names,
    };

    // Assuming fixdepartures is the model for your database collection
    const departure = await fixdepartures.find({ _id: data.flightId });
    // console.log(departure, "flight data");

    const flightData = {
      Sector: departure[0].Sector,
      DepartureDate: departure[0].DepartureDate,
      ReturnDate: departure[0].ReturnDate,
      Airlines: departure[0].Airlines,
      FlightNo: departure[0].FlightNo,
      OnwardTime: departure[0].OnwardTime,
      ReturnTime: departure[0].ReturnTime,
    };

    const allData = {
      ...flightData,
      ...data,
    };
    // console.log(allData,"alldata");
    const response = await fixdeparturebookings.create(allData);
    res.status(201).send({ status: "success", data: response });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

//**************GET ALL Fix Departure BOOKING *************/

exports.getAllFixDepartureBooking = async (req, res, next) => {
  try {
    const { page, limit, search, userId } = req.query;
    const isAgent = await findbrbuser({ _id: userId });
    if (!isAgent) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USERS_NOT_FOUND });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { loginName: { $regex: data, $options: "i" } },
            { emailId: { $regex: data, $options: "i" } },
            { status: { $regex: data, $options: "i" } },
          ],
        },
      },
    ];
    let aggregate = fixdeparturebookings.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await fixdeparturebookings.aggregatePaginate(
      aggregate,
      options
    );
    if (result.docs.length == 0) {
      return res
        .status(statusCode.OK)
        .send({statusCode:statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    return next(error);
  }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const results = [];
    const fileBuffer = req.file.buffer.toString("utf-8");

    // Parse CSV data directly from the file buffer
    const parsedData = await new Promise((resolve, reject) => {
      const stream = Readable.from([fileBuffer]);
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", reject);
    });

    // Save parsed data to MongoDB using Mongoose
    await fixdepartures.insertMany(parsedData);
    res.status(200).send("File uploaded and data saved to the database.");
  } catch (error) {
    res.status(500).send("Server error during file upload.");
  }
};

//cancel request if already booking Exit******************************
// exports.cancelRequest = function

//easy buzz payment controller
var configEaseBuzz = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};

// make payment
exports.easebuzzPayment = async (req, res, next) => {
  try {
    const {
      userId,
      firstname,
      phone,
      email,
      amount,
      productinfo,
      bookingType,
      surl,
      furl,
    } = req.body;

    const txnId = "T" + Date.now();
    const hashComponents = [
      configEaseBuzz.key,
      txnId,
      amount,
      productinfo,
      firstname,
      email,
    ];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|||||||||||${configEaseBuzz.salt}`;
    const sha512Hash = generateSHA512Hash(inputString);
    const encodedParams = new URLSearchParams();
    encodedParams.set("key", configEaseBuzz.key);
    encodedParams.set("txnid", txnId);
    encodedParams.set("amount", amount);
    encodedParams.set("productinfo", productinfo);
    encodedParams.set("firstname", firstname.trim());
    encodedParams.set("phone", phone);
    encodedParams.set("email", email);
    encodedParams.set("surl", `${surl}${txnId}`);
    encodedParams.set("furl", `${furl}${txnId}`);
    encodedParams.set("hash", sha512Hash);


    const options = {
      method: "POST",
      url: "https://pay.easebuzz.in/payment/initiateLink",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      data: encodedParams,
    };
    try {
      const { data } = await axios.request(options);
      // console.log(data);
      const result = {
        access: data.data,
        key: process.env.EASEBUZZ_KEY,
        env: process.env.EASEBUZZ_ENV,
      };
      const object = {
        userId: userId,
        amount: amount,
        paymentId: txnId,
        bookingType: bookingType,
        easepayid:'NA'
      };
      const createData = await agentWallets.create(object);
      res.status(201).send({
        statusCode: 201,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: result,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    return next(error);
  }
};

//success response********************************************************
exports.paymentSuccess = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await agentWallets.find({
      paymentId: merchantTransactionId,
    });
    if (isTransactionExist) {
      const result = await agentWallets.findOneAndUpdate(
        { _id: isTransactionExist[0]._id },
        { $set: { transactionStatus: "SUCCESS",easepayid: req.body.easepayid  } },
        { new: true }
      );

      //update wallet logic

      const user = await b2bUser.findById({
        _id: isTransactionExist[0].userId,
      });

      if (!user) {
        return sendActionFailedResponse(res, {}, "Invalid userId");
      }

      // Update the user's balance by adding the additional balance
      user.balance += Number(isTransactionExist[0].amount);

      // Save the updated user
      const updatedUser = await user.save();

      // Respond with the updated user object
      actionCompleteResponse(
        res,
        updatedUser,
        "User balance updated successfully"
      );
    }
  } catch (error) {
    return next(error);
  }
};


//payment success***************************************************************************************
exports.paymentSuccessAgent = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await agentWallets.find({
      paymentId: merchantTransactionId,
    });
    if (isTransactionExist) {
      const result = await agentWallets.findOneAndUpdate(
        { _id: isTransactionExist[0]._id },
        { $set: { transactionStatus: "SUCCESS",easepayid: req.body.easepayid  } },
        { new: true }
      );

      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_SUCCESS,
        result: result,
      });

     
    }
  } catch (error) {
    return next(error);
  }
};

//failed response********************************************************
exports.paymentFailure = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await agentWallets.find({
      paymentId: merchantTransactionId,
    });
    if (isTransactionExist) {
      const result = await agentWallets.findOneAndUpdate(
        { _id: isTransactionExist[0]._id },
        { $set: { transactionStatus: "FAILED" } },
        { new: true }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_FAILURE,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//create EditProfile as after admin add agent************************************************************
// Agent updates profile

exports.updateProfile = async (req, res) => {
  try {
    const {
      agentId,
      first_name,
      last_name,
      residential_address,
      address_2,
      telephone_number,
      pincode,
      country,
      state,
      city,
      agency_mobile,
      address,
      agencyaddress_2,
      agencyPincode,
      agencyCountry,
      agencyState,
      agencyCity,
      business_type,
      office_space,
      IATA_registration_id,
      IATA_code,
      TDS,
      TDS_percentage,
      references,
      consolidators,
      remarks,
      agency_gstName,
      agency_classification,
      agency_GSTIN,
      gst_state,
      gst_state_code,
      provisional_GSTIN,
      phone_number,
      contact_person,
      gst_email,
      correspondance_mail_id,
      GST_registration_status,
      HSN_SAC_code,
      composition_levy,
      address_line1,
      address_line2,
      gst_pincode,
      agency_city,
      supply_type
    } = req.body;
    const file = req.file;

    // Fetch the existing agent
    const agent = await b2bUser.findOne({ _id: agentId });
    if (!agent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }
    const updatedAgent = {
      personal_details: {
        first_name: first_name || agent.personal_details.first_name,
        last_name: last_name || agent.personal_details.last_name,
        email: agent.personal_details.email.toLowerCase(),
        mobile: { mobile_number: agent.personal_details.mobile.mobile_number },
        address_details: {
          residential_address:
            residential_address ||
            agent.personal_details.address_details.residential_address,
          address_2:
            address_2 || agent.personal_details.address_details.address_2,
          telephone_number:
            telephone_number ||
            agent.personal_details.address_details.telephone_number,
          pincode: pincode || agent.personal_details.address_details.pincode,
          country: country || agent.personal_details.address_details.country,
          state: state || agent.personal_details.address_details.state,
          city: city || agent.personal_details.address_details.city,
        },
        password: agent.personal_details.password,
      },
      agency_details: {
        agency_name: agent.agency_details.agency_name,
        agency_mobile: {
          mobile_number:
            agency_mobile || agent.agency_details.agency_mobile.mobile_number,
        },
        pan_number: agent.agency_details.pan_number,
        address: address || agent.agency_details.address,
        address_2: agencyaddress_2 || agent.agency_details.address_2,
        pincode: agencyPincode || agent.agency_details.pincode,
        country: agencyCountry || agent.agency_details.country,
        state: agencyState || agent.agency_details.state,
        city: agencyCity || agent.agency_details.city,
        business_type: business_type || agent.agency_details.business_type,
        office_space: office_space || agent.agency_details.office_space,
        IATA_registration_id:
          IATA_registration_id || agent.agency_details.IATA_registration_id,
        IATA_code: IATA_code || agent.agency_details.IATA_code,
        TDS: TDS || agent.agency_details.TDS,
        TDS_percentage: TDS_percentage || agent.agency_details.TDS_percentage,
        references: references || agent.agency_details.references,
        consolidators: consolidators || agent.agency_details.consolidators,
        remarks: remarks || agent.agency_details.remarks,
      },
      agency_gst_details: {
        agency_name: req.body.agency_gstName,
        agency_classification: req.body.agency_classification,
        agency_GSTIN: req.body.agency_GSTIN,
        state: req.body.gst_state,
        state_code: req.body.gst_state_code,
        provisional_GSTIN: req.body.provisional_GSTIN,
        contact_person:req.body.contact_person,
        phone_number: req.body.phone_number,
        telephone_number: req.body.gst_telephone_number,
        email: req.body.gst_email,
        correspondance_mail_id: req.body.correspondance_mail_id,
        GST_registration_status: req.body.GST_registration_status,
        HSN_SAC_code: req.body.HSN_SAC_code,
        composition_levy: req.body.composition_levy,
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        pincode: req.body.gst_pincode,
        agency_city: req.body.agency_city,
        supply_type: req.body.supply_type,
      },
    };

    // Upload new profile image to S3
    if (file) {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `agentImages/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      // Upload file to S3
      const data = await s3.upload(s3Params).promise();

      // Update agent's panCard Document with additional details and new panCard Document image
      updatedAgent.agency_details.document_details = {
        pan_card_document: data.Location,
      };
    }

    const updatedData=toString(updatedAgent);

    // Update the agent
    const updatedAgentData = await b2bUser.findOneAndUpdate(
      { _id: agentId },
      updatedAgent,
      { new: true }
    );

    res.json({ success: true, agent: updatedAgentData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

function generateSHA512Hash(input) {
  const hash = crypto.createHash("sha512");
  hash.update(input);
  return hash.digest("hex");
}

///agentProfilePage
exports.agentProfilePage = async (req, res) =>{

  const companyDomain = req.body.companyDomain;

  try {
    const userProfile=await  b2bUser.findOne({'companyDomain':companyDomain});
    // 65dda9fb34beb2ee7992f2d7
    // const userProfile=await  b2bUser.findOne({'_id':'65dda9fb34beb2ee7992f2d7'});

    if(!userProfile){
      return sendActionFailedResponse(res, {}, "Invalid Agent");
    }
    // actionCompleteResponse(res,userProfile,"Agent profile fetch successfully");

    const agentPackages = await exports.agentPackagesHelper(userProfile._id); // Assuming _id is used as userId
    if (!agentPackages) {
      return sendActionFailedResponse(res, {}, "Error fetching agent packages");
    }
    const agentStaticContent=await findAgentStaticContentData({agentId:userProfile._id});

    actionCompleteResponse(res, { userProfile, agentPackages,agentStaticContent }, "Agent profile and packages fetched successfully");

    
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");    
  }
}

//agentCommission
exports.agentCommission = async (req, res) => {
  const agentId = req.body.agentId;
  const updatedCommissionData = req.body.myCommission;

  try {
    // Find the agent profile
    const userProfile = await b2bUser.findOne({ _id: agentId });

    // If agent profile not found
    if (!userProfile) {
      return actionCompleteResponse(res, "data not found", "Invalid Agent");
    }

    // Update only the specified commission types
    Object.keys(updatedCommissionData).forEach(key => {
      if (userProfile.myCommission.hasOwnProperty(key)) {
        userProfile.myCommission[key] = updatedCommissionData[key];
      }
    });

    // Save the updated commission data
    await userProfile.save();

    // Send success response
    actionCompleteResponse(res, userProfile, "Agent commission updated successfully");
  } catch (error) {
    // Handle errors
    sendActionFailedResponse(res, {}, "Internal server error");
  }
};

//addAgentCommission
exports.addAgentCommission =async (req, res) =>{

  const {agentId, addAmount}=req.body;
  try {
    const userProfile = await b2bUser.findOne({ _id: agentId });

    // If agent profile not found, 
    if (!userProfile) {
      return actionCompleteResponse(res, "data not found", "Invalid Agent");
    }

    const newBalance = Number(userProfile.balance) + Number(addAmount);
    // Update the balance in the userProfile document
   const response= await b2bUser.updateOne({ _id: agentId }, { $set: { balance: newBalance } });

    actionCompleteResponse(res,  { balance: newBalance } , "Balance updated successfully");
    
  } catch (err) {
    sendActionFailedResponse(res, {}, "Internal server error");
    
  }
}

// updateCompanyDomain
exports.updateCompanyDomain =async (req, res) =>{

  const { agentId, companyDomain } = req.body;

  try {

    const agent = await b2bUser.findByIdAndUpdate(agentId, { companyDomain }, { new: true });

    if (!agent) {
      return actionCompleteResponse(res, "data not found", "Invalid Agent");
    }
   
    actionCompleteResponse(res, {companyDomain}, "Domain update Successfully");
    
  } catch (err) {

    sendActionFailedResponse(res, {}, "Internal server error");
    
  }
}

//agent packages
exports.agentPackagesHelper = async (userId) => {
  try {
    const packages = await internationl.find({ userId: userId,is_active: 1 });

    return packages;
  } catch (error) {
    throw new Error(error.message);
  }
};

//******************Check is referral code is valid *****************************************/
exports.checkReferralCode=async(req,res,next)=>{
  try {
    // const {referralCode}=req.body;
    const isCodeValid=await b2bUser.findOne({referralCode:req.params.referralCode});
    if(!isCodeValid){
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage:responseMessage.REFERRALCODE_NOT_EXIST });
    }
    return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage:responseMessage.REFERRALCODE_APPLIED,result:isCodeValid });
  } catch (error) {
    return next(error);
  }
}

exports.checkIsExits = async (req, res, next) => {
  try {
    const { agencyName } = req.body;
    
    // Construct a regex pattern to match substrings of the normalized search query
    const regexPattern = new RegExp(agencyName.replace(/\s+/g, ''), 'i');
    // Find if any agency name matches the regex pattern
    const isAgentExist = await b2bUser.find({
      'agency_details.agency_name': { $regex: regexPattern }
    });

    if (!isAgentExist) {   
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.AGENT_NOT_FOUND });
    }

    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage:true, result: isAgentExist });
   
  } catch (error) {
    return next(error);
  }
}

//****************************for update socialID***********************************/
exports.updatePersonalProfile=async(req,res,next)=>{
  try {
    const {agentId,instaId,facebookId,googleId,linkedinId}=req.body;
    const isAgentExist=await findbrbuser({_id:agentId}) ;
    if(!isAgentExist){
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage:responseMessage.AGENT_NOT_FOUND });
    }
    var imageUrl;
    if(req.file){
       imageUrl = await commonFunction.getImageUrlAWS(req.file);
      if (!imageUrl) {
        return res.status(statusCode.InternalError).send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.INTERNAL_ERROR,
        });
      }
    }
    const object={
      agentProfileBanner:imageUrl,
      socialId:{
        instaId,facebookId,googleId,linkedinId
      }
    }
    const result=await updatebrbuser({_id:isAgentExist._id},object);
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage:responseMessage.UPDATE_SUCCESS ,result:result});
  } catch (error) {
    return next(error);
  }
}

//***********************for agent profile banner************************************/
exports.randomPayment=async (req, res, next) => {
  try {
    const {
      firstname,
      phone,
      email,
      amount,
      productinfo,
      bookingType,
      surl,
      furl,
    } = req.body;

    const txnId = "T" + Date.now();
    const hashComponents = [
      configEaseBuzz.key,
      txnId,
      amount,
      productinfo,
      firstname,
      email,
    ];
    const hashString = hashComponents.join("|");
    const inputString = `${hashString}|||||||||||${configEaseBuzz.salt}`;
    const sha512Hash = generateSHA512Hash(inputString);
    const encodedParams = new URLSearchParams();
    encodedParams.set("key", configEaseBuzz.key);
    encodedParams.set("txnid", txnId);
    encodedParams.set("amount", amount);
    encodedParams.set("productinfo", productinfo);
    encodedParams.set("firstname", firstname.trim());
    encodedParams.set("phone", phone);
    encodedParams.set("email", email);
    encodedParams.set("surl", `${surl}${txnId}`);
    encodedParams.set("furl", `${furl}${txnId}`);
    encodedParams.set("hash", sha512Hash);


    const options = {
      method: "POST",
      url: "https://pay.easebuzz.in/payment/initiateLink",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      data: encodedParams,
    };
    try {
      const { data } = await axios.request(options);
      const result = {
        access: data.data,
        key: process.env.EASEBUZZ_KEY,
        env: process.env.EASEBUZZ_ENV,
      };
      const object = {
        name: firstname,
        amount: amount,
        paymentId: txnId,
        bookingType: bookingType,
        easepayid:'NA',
        email:email,
        phone:phone

      };
      const createData = await randomPayments.create(object);
      res.status(201).send({
        statusCode: 201,
        responseMessage: responseMessage.PAYMENT_INTIATE,
        result: result,
      });
    } catch (error) {
      console.error("error axios:===========>>>>>>>>>>", error);
    }
  } catch (error) {
    return next(error);
  }
};

//success
exports.randomPaymentSuccess = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await randomPayments.find({
      paymentId: merchantTransactionId,
    });
    if (isTransactionExist) {
      const result = await randomPayments.findOneAndUpdate(
        { _id: isTransactionExist[0]._id },
        { $set: { transactionStatus: "SUCCESS",easepayid: req.body.easepayid  } },
        { new: true }
      );



      // Respond with the updated user object
      actionCompleteResponse(
        res,
        result,
        "Payment successfully Received"
      );
    }
  } catch (error) {
    return next(error);
  }
};

exports.randomPaymentFailure= async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await randomPayments.find({
      paymentId: merchantTransactionId,
    });
    
    if (isTransactionExist) {
      const result = await randomPayments.findOneAndUpdate(
        { _id: isTransactionExist[0]._id },
        { $set: { transactionStatus: "FAILED" } },
        { new: true }
      );
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_FAILURE,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//***********************************************************Delete Agent***********************************************/
exports.deleteAgent=async(req,res,next)=>{
  try {
    const {agentId}=req.body;
    const isAgentExist=await findbrbuser({_id:agentId}) ;
    if(!isAgentExist){
      return res.status(statusCode.OK).send({ statusCode: statusCode.NotFound, responseMessage:responseMessage.AGENT_NOT_FOUND });
    }
    const deletedData=await deletebrbuser({_id:isAgentExist._id});
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage:responseMessage.DELETE_SUCCESS,result:deletedData });
  } catch (error) {
    return next(error);
  }
};

//***************************************************Agent Revenue****************************************************/
exports.getRevenueOfAgent = async (req, res, next) => {
  try {
    const { agentId } = req.query;
    
    if (!ObjectId.isValid(agentId)) {
      return res.status(statusCode.badRequest).send({ 
        statusCode: statusCode.badRequest, 
        responseMessage: responseMessage.INVALID_AGENT_ID 
      });
    }
    
    const agentObjectId = new ObjectId(agentId);

    // Check if the agent exists
    const isAgentExist = await findbrbuser({ _id: agentObjectId });
    if (!isAgentExist) {
      return res.status(statusCode.NotFound).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.AGENT_NOT_FOUND 
      });
    }


    // Aggregate flight bookings to calculate total revenue
    const flightAggregateResult = await flightModel.aggregate([
      { $match: { userId: agentObjectId } }, // Filter by agentId
      { $group: { _id: "$userId", totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const hotelAggregateResult = await hotelBookingModel.aggregate([
      { $match: { userId: agentObjectId } }, // Filter by agentId
      { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
    ]);
    const busAggregateResult = await busBookingModel.aggregate([
      { $match: { userId: agentObjectId } }, // Filter by agentId
      { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
    ]);
    // Extract total revenue from aggregation result
    const flightRevenue = flightAggregateResult.length > 0 ? flightAggregateResult[0].totalRevenue : 0;
    const hotelRevenue = hotelAggregateResult.length > 0 ? hotelAggregateResult[0].totalRevenue : 0;
    const busRevenue = busAggregateResult.length > 0 ? busAggregateResult[0].totalRevenue : 0;

    const totalRevenue=flightRevenue+hotelRevenue+busRevenue

    // Send the response with the total revenue
    return res.status(statusCode.OK).send({ 
      statusCode: statusCode.Success, 
      responseMessage: responseMessage.DATA_FOUND, 
      result: { totalRevenue }
    });

  } catch (error) {
    return next(error);
  }
};

//***************************************************Forget Password**************************************************/
exports.forgetPassword=async(req,res,next)=>{
  try {
    const {email,redirectUrl}=req.body;
    const isEmailExist=await findbrbuser({"personal_details.email":email.toLowerCase()});
if(!isEmailExist){
  return res.status(statusCode.OK).send({ 
    statusCode: statusCode.NotFound, 
    responseMessage: responseMessage.EMAIL_NOT_EXIST 
  });
}
// const link=`localhost:8000/skyTrails/api/agent/resetPassword/${isEmailExist._id}`
await commonFunction.sendAgentEmailResetPassword(email,isEmailExist._id)
return res.status(statusCode.OK).send({ 
  statusCode: statusCode.OK, 
  responseMessage: responseMessage.RESET_LINK_SEND 
});
  } catch (error) {
    return next(error);
  }
};

//***************************************************Reset Password**************************************************/
exports.resetPassword=async(req,res,next)=>{
  try {
    const {id}=req.params;
    const {password,confirmpassword}=req.body;
    const isEmailExist=await findbrbuser({_id:id});
    if(!isEmailExist){
      return res.status(statusCode.OK).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.EMAIL_NOT_EXIST 
      });
    }
    if(password!==confirmpassword){
      return res.status(statusCode.OK).send({ 
        statusCode: statusCode.badRequest, 
        responseMessage: responseMessage.PASSWORD_NOT_MATCH 
      });
    }
    const hashPass=await bcrypt.hashSync(password,10);
    await updatebrbuser({_id:isEmailExist._id},{"personal_details.password":hashPass});
    return res.status(statusCode.OK).send({ 
      statusCode: statusCode.OK, 
      responseMessage: responseMessage.UPDATE_SUCCESS 
    });
  } catch (error) {
    return next(error)
  }
};

//*******************************************************All user revenue*****************************************************/
exports.getAllAgentRevenue=async(req,res,next)=>{
  try {
    let result=[];
    const agentList=await brbuserList({});
    if(agentList.length<1){
      return res.status(statusCode.NotFound).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.AGENT_NOT_FOUND 
      });
    }
    for(var agent of agentList){
      let agentWiseRevenue={agentId:agent._id,agentName:agent.personal_details.first_name,email:agent.personal_details.email}
      const agentObjectId = new ObjectId(agent._id);

      const flightAggregateResult = await flightModel.aggregate([
        { $match: { userId: agentObjectId } }, // Filter by agentId
        { $group: { _id: "$userId", totalRevenue: { $sum: "$totalAmount" } } }
      ]);
      const hotelAggregateResult = await hotelBookingModel.aggregate([
        { $match: { userId: agentObjectId } }, // Filter by agentId
        { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
      ]);
      const busAggregateResult = await busBookingModel.aggregate([
        { $match: { userId: agentObjectId } }, // Filter by agentId
        { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
      ]);
      const flightRevenue = flightAggregateResult.length > 0 ? flightAggregateResult[0].totalRevenue : 0;
    const hotelRevenue = hotelAggregateResult.length > 0 ? hotelAggregateResult[0].totalRevenue : 0;
    const busRevenue = busAggregateResult.length > 0 ? busAggregateResult[0].totalRevenue : 0;

    agentWiseRevenue.totalRevenue=flightRevenue+hotelRevenue+busRevenue
    result.push(agentWiseRevenue);
    }
    return res.status(statusCode.OK).send({ 
      statusCode: statusCode.Success, 
      responseMessage: responseMessage.DATA_FOUND, 
      result: result,
    });
  } catch (error) {
    return next(error)
  }
}


exports.getAgentTableWithRevenue=async(req,res,next)=>{
  try {
    const agentList=await brbAgentList({});
    if(agentList.length<1){
      return res.status(statusCode.NotFound).send({ 
        statusCode: statusCode.NotFound, 
        responseMessage: responseMessage.AGENT_NOT_FOUND 
      });
    }
     const revenuePromises = agentList.map(async (agent) => {
      let agentObj = { ...agent._doc };
      const agentObjectId = new ObjectId(agent._id);
      const [flightAggregateResult, hotelAggregateResult, busAggregateResult] = await Promise.all([
        flightModel.aggregate([
          { $match: { userId: agentObjectId } },
          { $group: { _id: "$userId", totalRevenue: { $sum: "$totalAmount" } } }
        ]),
        hotelBookingModel.aggregate([
          { $match: { userId: agentObjectId } },
          { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
        ]),
        busBookingModel.aggregate([
          { $match: { userId: agentObjectId } },
          { $group: { _id: "$userId", totalRevenue: { $sum: "$amount" } } }
        ])
      ]);
      const flightRevenue = flightAggregateResult.length > 0 ? flightAggregateResult[0].totalRevenue : 0;
      const hotelRevenue = hotelAggregateResult.length > 0 ? hotelAggregateResult[0].totalRevenue : 0;
      const busRevenue = busAggregateResult.length > 0 ? busAggregateResult[0].totalRevenue : 0;
      agentObj.totalRevenue = flightRevenue + hotelRevenue + busRevenue;
     return agentObj
    });
    const revenueResults = await Promise.all(revenuePromises);
    return res.status(statusCode.OK).send({ 
      statusCode: statusCode.Success, 
      responseMessage: responseMessage.DATA_FOUND, 
      result: revenueResults,
    });
  } catch (error) {
    return next(error)
  }
}


exports.addBalance=async(req,res,next)=>{
  try {
    const {amount,agentId,currency,adminId}=req.body;
    const user = await User.findById(adminId);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === "admin") {
      const isAgentExist=await b2bUser.findOne({_id:agentId});
      if(!isAgentExist){
        return res.status(statusCode.NoContent).json({
          responceCode: statusCode.NoContent,
          responseMessages:responseMessage.AGENT_NOT_FOUND,
        });
      }
      // const isWalletHistoryExist=await agentWalletHistory.findOne({agnetId:isAgentExist._id});
      // if(isWalletHistoryExist){
      //   await agentWalletHistory.updateOne({_id:isWalletHistoryExist._id},{amount:amount})
      // }
      agentWalletHistory.create({agnetId:isAgentExist._id,amount:amount,transactionType:'Credit',bookingType:'added by Admin'})
      const updateBalance=await b2bUser.updateOne({_id:isAgentExist._id},{ $inc: { balance: amount } },{new:true});
      return res.status(statusCode.OK).json({
        responceCode: statusCode.OK,
        responseMessages:responseMessage.UPDATE_SUCCESS,
        result:updateBalance,
      });
    }
  } catch (error) {
    return next(error);
  }
}