const db = require("../model");
const b2bUser = db.userb2b;
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const wallet = require("../model/wallet.model");
const agentWallets = require("../model/agentWallet.model");
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
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const bookingStatus = require("../enums/bookingStatus");
//************SERVICES*************** */

const { brbuserServices } = require("../services/btobagentServices");
const userType = require("../enums/userType");
const status = require("../enums/status");
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
const {
  createbrbuser,
  findbrbuser,
  getbrbuser,
  findbrbuserData,
  updatebrbuser,
  deletebrbuser,
  brbuserList,
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
  const file = req?.file;
  var salt = bcrypt.genSaltSync(10);
  // console.log(reqData.personal_details.password);
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Save user to database
      const user = new b2bUser({
        personal_details: {
          ...reqData.personal_details,
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
        actionCompleteResponse(res, response, msg);
      } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

exports.LoginUser = async (req, res) => {
  try {
    const user = await b2bUser.findOne({
      "personal_details.email": req.body.email,
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
    console.error(error);
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
    };

    await b2bUser.findOneAndUpdate(findCri, updateCri, { new: true });
    msg = "Status has been updated successfully";
    let resData = {
      updateCri,
    };
    actionCompleteResponse(res, resData, msg);
  } catch (error) {
    console.log(err);
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
    console.log(error);
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
    console.log(error);
  }
};

//update b2b balance using razorpay
// exports.updateUserBalance = async (req, res) => {

//   try {
//     const { _id, amount, paymentId } = req.body; // Destructure userId and additionalBalance from the request body

//     // Check if userId is valid in your user table
//     console.log(req.body);

//     let instance = new Razorpay({
//       key_id: process.env.Razorpay_KEY_ID,
//       key_secret: process.env.Razorpay_KEY_SECRET,
//     });

//     var options = {
//       amount: Number(req.body.amount) * 100, // amount in the smallest currency unit
//       currency: "INR",
//       receipt: "order_rcptid_11",
//     };
//     console.log(req.body.amount);
//     instance.orders.create(options, function (err, order) {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ code: 500, message: "Server Error" });
//       }

//       console.log(order);
//       // return res.send({
//       //   code: 200,
//       //   message: "order Created Successfully",
//       //   data: order,
//       // });
//     });

//     const AgentWalletData={
//       userId:_id,
//       orderId:paymentId,
//       amount:amount
//     };
//     await agentWallets.create(AgentWalletData);
//     const user = await b2bUser.findById(_id);

//     if (!user) {
//       return sendActionFailedResponse(res, {}, "Invalid userId");
//     }

//     // Update the user's balance by adding the additional balance
//     user.balance += Number(amount);

//     // Save the updated user
//     const updatedUser = await user.save();

//     // Respond with the updated user object
//     actionCompleteResponse(res, updatedUser, "User balance updated successfully");

//   } catch (error) {
//     sendActionFailedResponse(res, {}, "Internal server error");
//     console.log(error);
//   }

// };

exports.payVerify = (req, res) => {
  try {
    // console.log(req.body);
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
    console.log(error);
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
    console.log(error);
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
    // console.log("busBookData===========", busBookData);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: combinedData });
  } catch (error) {
    console.log("error==============", error);
    return next(error);
  }
};

//subtract Balance

exports.subtractBalance = async (req, res) => {
  try {
    const { _id, amount } = req.body;

    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "Invalid userId");
    }

    // Update the user's balance by subtracting balance
    user.balance -= Number(amount);

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user object
    actionCompleteResponse(
      res,
      updatedUser,
      "User balance updated successfully"
    );
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
};

//************GET ALL HOTEL BOOKING LIST ***************/

exports.getAllAgentHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate, userId } = req.query;
    const isAgent = await findbrbuser({ _id: userId });
    // console.log(isAgent,"agent found");
    if (!isAgent) {
      return res.status(statusCode.NotFound).send({
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
      return res.status(statusCode.NotFound).send({
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
    console.log("error=======>>>>>>", error);
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
        .status(statusCode.NotFound)
        .send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
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
        .status(statusCode.NotFound)
        .send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};

//**************CANCEL BOOKINGS BY AGENT****************/

exports.cancelBookingByAgent = async (req, res, next) => {
  try {
    const {} = req.body;
  } catch (error) {
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("error", error);
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
    console.log("Error to getting data", error);
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
    console.log("Error to getting data", error);
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
    console.log("Error to getting data", error);
    return next(error);
  }
};

exports.addSector = async (req, res) => {
  try {
    const { Sector } = req.body;
    console.log(Sector);
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
        .status(statusCode.NotFound)
        .send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
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
    console.error("Error uploading file:", error);
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
    encodedParams.set("firstname", firstname);
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
    console.log("error into easebuzz ", error);
    return next(error);
  }
};

//success response********************************************************
exports.paymentSuccess = async (req, res, next) => {
  try {
    // console.log("successVerifyApi==",req.body.easepayid);
    const { merchantTransactionId } = req.query;
    const isTransactionExist = await agentWallets.find({
      paymentId: merchantTransactionId,
    });
    //  console.log("isTransactionExist==",isTransactionExist)
    if (isTransactionExist) {
      // console.log("isTransactionExist=========",isTransactionExist);
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
    console.log("error ==========", error);
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
    //  console.log("failed==",merchantTransactionId);
    //  console.log("isTransactionExist==",isTransactionExist);
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
    console.log("error on failure operation", error);
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
    // console.log("agent==============",agent);
    // Build update object with existing data
    const updatedAgent = {
      personal_details: {
        first_name: first_name || agent.personal_details.first_name,
        last_name: last_name || agent.personal_details.last_name,
        email: agent.personal_details.email,
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
        Key: file.originalname,
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
    console.log("updatedData=============",updatedAgent);

    // Update the agent
    const updatedAgentData = await b2bUser.findOneAndUpdate(
      { _id: agentId },
      updatedAgent,
      { new: true }
    );

    res.json({ success: true, agent: updatedAgentData });
  } catch (err) {
    console.error(err);
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

  const firstName = req.params.first_name;

  try {
    const userProfile=await  b2bUser.findOne({'personal_details.first_name':firstName});
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

    actionCompleteResponse(res, { userProfile, agentPackages }, "Agent profile and packages fetched successfully");

    
  } catch (error) {
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