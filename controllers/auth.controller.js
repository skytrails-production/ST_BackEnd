const config = require("../config/auth.config");
const db = require("../model");
const User = db.user;
const b2bUser = require("../model/brbuser.model");
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require("../utilities/commonFunctions");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const whatsappAPIUrl = require("../utilities/whatsApi");
//************SERVICES*************** */
const {appVersionServices}=require("../services/appVersionServices")
const {createappVersion,findappVersion,deleteappVersion,appVersionList,updateappVersion}=appVersionServices;
const { userServices } = require("../services/userServices");
const userType = require("../enums/userType");
const status = require("../enums/status");
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const {
  aggregatePaginateHotelBookingList,
  aggregatePaginateHotelBookingList1,
  aggregatePaginateGrnHotelBookingList,
  findhotelBooking,
  findhotelBookingData,
  deletehotelBooking,
  updatehotelBooking,
  hotelBookingList,
  countAgentTotalBooking,
} = hotelBookingServicess;
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
  aggregatePaginateUser,
} = userServices;
const { visaServices } = require("../services/visaServices");
const {
  createWeeklyVisa,
  findWeeklyVisa,
  deleteWeeklyVisa,
  weeklyVisaList,
  updateWeeklyVisa,
  weeklyVisaListPaginate,
} = visaServices;
const { brbuserServices } = require("../services/btobagentServices");
const {
  createbrbuser,
  findbrbuser,
  findbrbData,
  findOneAgent,
  getbrbuser,
  findbrbuserData,
  updatebrbuser,
  deletebrbuser,
  brbuserList,
  paginatebrbuserSearch,
  countTotalbrbUser,
} = brbuserServices;
const {
  userflightBookingServices,
} = require("../services/btocServices/flightBookingServices");
const {
  aggregatePaginateGetBooking,
  aggregatePaginateGetBooking1,
  countTotalUserFlightBooking,
} = userflightBookingServices;
const {
  cancelUserBookingServices,
} = require("../services/btocServices/cancelBookingServices");
const {
  createcancelFlightBookings,
  findAnd,
  updatecancelFlightBookings,
  aggregatePaginatecancelFlightBookingsList1,
  countTotalcancelFlightBookings,
  createHotelCancelRequest,
  updateHotelCancelRequest,
  getHotelCancelRequesrByAggregate,
  countTotalHotelCancelled,
  createBusCancelRequest,
  updateBusCancelRequest,
  getBusCancelRequestByAggregate,
  countTotalBusCancelled,
} = cancelUserBookingServices;
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
const {
  markupModelServices,
} = require("../services/btocServices/markupServices");
const {
  createMarkup,
  findMarkup,
  getUserMarkup,
  deleteMarkup,
  markupList,
  updateMarkup,
  countTotalMarkup,
} = markupModelServices;
const {
  userBusBookingServices,
} = require("../services/btocServices/busBookingServices");
const {
  createUserBusBooking,
  findUserBusBooking,
  getUserBusBooking,
  findUserBusBookingData,
  deleteUserBusBooking,
  userBusBookingList,
  updateUserBusBooking,
  paginateUserBusBookingSearch,
  countTotalUserBusBooking,
} = userBusBookingServices;
const {
  userhotelBookingModelServices,
} = require("../services/btocServices/hotelBookingServices");
const {
  createUserhotelBookingModel,
  findUserhotelBookingModel,
  getUserhotelBookingModel,
  deleteUserhotelBookingModel,
  userhotelBookingModelList,
  updateUserhotelBookingModel,
  paginateUserhotelBookingModelSearch,
  countTotalhotelBooking,
  aggregatePaginateHotelBookingList2,
} = userhotelBookingModelServices;
const { subAdminServices } = require("../services/subAdminServices");
const {
  createSubAdmin,
  findSubAdmin,
  findSubAdminData,
  deleteSubAdmin,
  subAdminList,
  updateSubAdmin,
  paginateSubAdminSearch,
  countTotalSubAdmin,
} = subAdminServices;
const { cancelBookingServices } = require("../services/cancelServices");
const {
  aggregatecancelFlightBookingsList,
  getAgentHotelCancelRequesrByAggregate,
  getBusCancellationAgent,
  countTotalAgentBusCancelled,
  countTotalAgentHotelCancelled,
  countTotalAgentcancelFlightBookings,
} = cancelBookingServices;
const {
  changeUserBookingServices,
} = require("../services/btocServices/changeRequestServices");
const {
  flightchangeRequestUserList,
  hotelchangeRequestUserList,
  buschangeRequestUserList,
  countChangeBusRequest,
  countChangeHotelRequest,
  countChangeFlightRequest,
} = changeUserBookingServices;
const {
  userSerachesServices,
} = require("../services/btocServices/userSearchServices");
const {
  createUserSearch,
  findUserSearch,
  deleteUserSearch,
  userSearchList,
  updateUserSearch,
} = userSerachesServices;
const {
  eventBookingServices,
} = require("../services/btocServices/eventBookingServices");
const {
  createBookingEvent,
  findBookingEventData,
  deleteBookingEvent,
  eventBookingList,
  updateBookingEvent,
  countTotalBookingEvent,
  eventBookingListPopulated,
  getBookingEvent,
  getEventPopulate,
} = eventBookingServices;
const {agentRewardServices}=require("../services/agentRewardServices");
const {createAgentReward,findAgentReward,deleteAgentReward,AgentRewardList,updateAgentReward,AgentRewardListPaginate}=agentRewardServices;
const{referralAmountServices}=require('../services/referralAmountServices');
const {createReferralAmount,findReferralAmount,deleteReferralAmount,referralAmountList,updateReferralAmount,referralAmountListPaginate}=referralAmountServices;
const {packageBannerServices}=require('../services/packageBannerServices');
const {createPackageBanner,findPackageBanner,findPackageBannerData,deletePackageBanner,updatePackageBanner}=packageBannerServices;
const{popularDestinationServices}=require('../services/popularDestinationServices');
const{createPopularDestination,findPopularDestination,findPopularDestinationData,deletePopularDestination,updatePopularDestination}=popularDestinationServices;
const {packageCategoryServices}=require('../services/packageCategoryServices');
const {createPackageCategory,findPackageCategory,findPackageCategoryData,deletePackageCategory,updatePackageCategory}=packageCategoryServices;

//**********Necessary models***********/
const flightModel = require("../model/flightBookingData.model");
const hotelBookingModel = require("../model/hotelBooking.model");
const fixdeparturebookings = require("../model/addFixDepartureBooking");
const busBookingModel = require("../model/busBookingData.model");
const userFlightBookingModel = require("../model/btocModel/flightBookingModel");
const userhotelBookingModel = require("../model/btocModel/hotelBookingModel");
const userbusBookingModel = require("../model/btocModel/busBookingModel");
const bookingStatus = require("../enums/bookingStatus");
const { actionCompleteResponse, sendActionFailedResponse } = require("../common/common");
const { GrnHotelBooking } = require("../model/grnconnectModel");

// exports.signup = (req, res) => {
//   const user = new User({
//     username: req.body.username,
//     email: req.body.email,
//     phone: {
//       country_code: req.body.country_code,
//       mobile_number: req.body.phone.mobile_number,
//     },
//     password: bcrypt.hashSync(req.body.password, 8),
//   });

//   user.save((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     if (req.body.roles) {
//       Role.find(
//         {
//           name: { $in: req.body.roles },
//         },
//         (err, roles) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }

//           user.roles = roles.map((role) => role._id);
//           user.save((err) => {
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }

//             res.send({ message: "User was registered successfully!" });
//           });
//         }
//       );
//     } else {
//       Role.findOne({ name: "user" }, (err, role) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         user.roles = [role._id];
//         user.save((err) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }

//           res.send({ message: "User was registered successfully!" });
//         });
//       });
//     }
//   });
// };
exports.signin = (req, res) => {
  // need change username to email for body parser then successfully login
  User.findOne({
    email: req.body.username,
    // $or:[{email:req.body.email},{username:req.body.username}]
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
      });
    });
};
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
//*****************SOCIAL LOGIN***************** */
exports.socialLogin = async (req, res, next) => {
  try {
    const {
      socialId,
      socialType,
      deviceType,
      deviceToken,
      username,
      email,
      mobileNumber,
      password,
      userId,
    } = req.body;
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const user = await User.findOne({
      $or: [{ _id: userId }, { email: email }],
    });
    if (!user) {
      const hashedPass = bcrypt.hashSync(password, 10);

      const data = {
        socialId: socialId,
        socialType: socialType,
        deviceType: deviceType,
        deviceToken: deviceToken,
        username: username,
        email: email,
        isSocial: true,
        isOnline: true,
        otpVerification: true,
        firstTime: false,
        phone: {
          mobile_number: mobileNumber,
        },
        password: hashedPass || "",
      };
      // const result = await User.create(data)
      return res
        .status(200)
        .send({
          message: "Your account created successfully.",
          result: result,
        });
    }
    let token = await commonFunction.getToken({
      id: userInfo._id,
      email: userInfo.email,
      userType: userInfo.userType,
    });
    const data = {
      socialId: socialId,
      socialType: socialType,
      deviceType: deviceType,
      deviceToken: deviceToken,
      username: username,
      email: email,
      isSocial: true,
      isOnline: true,
      otpVerification: true,
      firstTime: false,
      phone: {
        mobile_number: mobileNumber,
      },
    };
    await User.findOneAndUpdate({ _id: user._id }, data, { new: true });
    return res
      .status(200)
      .json({ message: "Social login successful.", result: user, token });
  } catch (error) {
    console.log("error========>>>>>>", error);
    return next(error);
  }
};
//approve regect user request to become an agent**************************
exports.approveAgent = async (req, res, next) => {
  try {
    const { userId, approveStatus, reason } = req.body;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    // }
    const iUserExist = await findbrbuser({
      _id: userId,
      userType: userType.AGENT,
    });
    if (!iUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USER_NOT_FOUND });
    }
    let updateResult = await updatebrbuser(
      { _id: iUserExist._id },
      { approveStatus: approveStatus, isApproved: true,is_active:1, reason: reason }
    );
    if (approveStatus === approvestatus.APPROVED) {
      // await sendSMS.sendSMSAgents(mobile_number, email);
      // const msg = `Welcome to TheSkyTrails, Admin added you as an agent. Please use the following credentials to login and fill in the mandatory form:\nEmail: ${email}, and Password: ${password} .click here: ${process.env.AGENT_URL}`;
      // // await whatsappAPIUrl.sendWhatsAppMessage(mobile_number, msg);
      // await commonFunction.sendAgent(email, password);
      return res
        .status(statusCode.OK)
        .send({ message: responseMessage.APPROVED, result: updateResult });
       
    } else {
      return res
        .status(statusCode.OK)
        .send({ message: responseMessage.REJECTED, result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//active blockuser **********************
exports.activeBlockUser = async (req, res, next) => {
  try {
    const { userId, actionStatus } = req.body;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.Unauthorized).send({ message: "User not authorized ." });
    // }
    const iUserExist = await findUser({ _id: userId, status: status.ACTIVE });
    if (!iUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({ message: "User not Found ." });
    }
    let updateResult = await updateUser(
      { _id: iUserExist._id },
      { status: actionStatus }
    );
    if (actionStatus === status.ACTIVE) {
      return res
        .status(statusCode.OK)
        .send({ message: "User active successfully .", result: updateResult });
    } else {
      return res
        .status(statusCode.OK)
        .send({ message: "User blocked successfully .", result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//active block agents **********************
exports.activeBlockUser = async (req, res, next) => {
  try {
    const { userId, actionStatus } = req.body;
    const isAdmin = await findbrbuser({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    if (!isAdmin) {
      return res
        .status(statusCode.Unauthorized)
        .send({ message: "User not authorized ." });
    }
    const iUserExist = await findbrbuser({
      _id: userId,
      status: status.ACTIVE,
    });
    if (!iUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({ message: "User not Found ." });
    }
    let updateResult = await updatebrbuser(
      { _id: iUserExist._id },
      { status: actionStatus }
    );
    if (actionStatus === status.ACTIVE) {
      return res
        .status(statusCode.OK)
        .send({ message: "User active successfully .", result: updateResult });
    } else {
      return res
        .status(statusCode.OK)
        .send({ message: "User blocked successfully .", result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//adminLogin****************************
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, mobileNumber, password } = req.body;
    const isAdminExist = await findUser({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
      userType: userType.ADMIN,
      status: status.ACTIVE,
    });
    if (!isAdminExist) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
    const isMatched = bcrypt.compareSync(password, isAdminExist.password);
    if (!isMatched) {
      return res
        .status(statusCode.badRequest)
        .send({ message: responseMessage.INCORRECT_LOGIN });
    }
    const token = await commonFunction.getToken({
      id: isAdminExist._id,
      email: isAdminExist.email,
      userType: isAdminExist.userType,
    });
    const result = {
      token,
      isAdminExist,
    };
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.LOGIN, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//*********Edit profile***************/
exports.editProfile = async (req, res, next) => {
  try {
    const { username, email, mobile_number, profilePic } = req.body;
    const isAdmin = await findUser({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    if (!isAdmin) {
      return res
        .status(statusCode.Unauthorized)
        .send({ message: responseMessage.UNAUTHORIZED });
    }
    if (email || mobile_number) {
      const isSubAdminAlreadyExist = await findUser({
        $or: [{ email: email }, { mobile_number: mobile_number }],
        _id: { $nin: isAdmin._id },
      });
      if (isSubAdminAlreadyExist) {
        return res
          .status(statusCode.Conflict)
          .send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    }
    if (req.file) {
      req.body.profilePic = await commonFunction.getImageUrl(req.file);
    }
    const result = await updateUser({ _id: isAdmin._id }, req.body);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.UPDATE_SUCCESS, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//*********Get all userList Admin**************/
exports.getAgents = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const result = await paginatebrbuserSearch(req.query);
    if (result.docs.length == 0) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.DATA_NOT_FOUND });
    }
    // console.log("result========", result);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//************GET ALL HOTEL BOOKING LIST ***************/
exports.getAllHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const result = await aggregatePaginateHotelBookingList1(req.query);
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


//************GET ALL GRN HOTEL BOOKING LIST ***************/
exports.getAllGrnHotelBookingList = async (req, res, next) => {
  try {
    let { page, limit, search, fromDate } = req.query;

    // Set default values for pagination
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Construct the query based on search criteria
    let query = {};
    if (search) {
      query.$or = [
        { "hotel.name": { $regex: search, $options: "i" } },
        { "holder.name": { $regex: search, $options: "i" } },
        { "holder.email": { $regex: search, $options: "i" } },
        { "destination": { $regex: search, $options: "i" } },
        { "night": parseInt(search) || 0 }, // Handle numeric search
        { "room": parseInt(search) || 0 }, // Handle numeric search
        { "bookingStatus": { $regex: search, $options: "i" } }
      ];
    }
    if (fromDate) {
      query.checkin = { $eq: new Date(fromDate) };
    }

    // Perform pagination using Mongoose paginate method
    const options = {
      page: page,
      limit: limit,
      sort: { createdAt: -1 } // Sorting by createdAt in descending order
    };
    const result = await GrnHotelBooking.paginate(query, options);

    // Send response
    const responseData = {
      totalItems: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      itemsPerPage: result.limit,
      data: result.docs
    };
    const msg = "Hotel Bookings fetched successfully!"; // Use let instead of const here
    actionCompleteResponse(res, responseData, msg); // Use let instead of const here
  } catch (err) {
    sendActionFailedResponse(res, {}, err.message); // Use let instead of const here
  }
};

//**************GET ALL FLIGHT BOOKING LIST*************/
exports.getAllFlightBookingList = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
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
          as: "UserDetails",
        },
      },
      {
        $unwind: {
          path: "$UserDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { flightName: { $regex: data, $options: "i" } },
            { "UserDetails.username": { $regex: data, $options: "i" } },
            { "UserDetails.email": { $regex: data, $options: "i" } },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: parseInt(data) },
            { bookingId: parseInt(data) },
          ],
        },
      },
    ];
    let aggregate = userFlightBookingModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: { createdAt: -1 },
    };
    const result = await userFlightBookingModel.aggregatePaginate(
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
//**************DashBoard*************/
exports.adminDashBoard = async (req, res, next) => {
  try {
    var result = {};
    const userFlightBooking = await countTotalUserFlightBooking({
      status: status.ACTIVE,
    });
    const userBusBooking = await countTotalUserBusBooking({
      status: status.ACTIVE,
    });
    const userHotelBooking = await countTotalhotelBooking({
      status: status.ACTIVE,
    });
    const agentHotelBooking = await countAgentTotalBooking({
      status: status.ACTIVE,
    });
    const agentFlightBooking = await flightModel.countDocuments({
      status: status.ACTIVE,
    });
    const agentBusBooking = await busBookingModel.countDocuments({
      status: status.ACTIVE,
    });
    const agentCancelBusBookingCount = await countTotalAgentBusCancelled({
      status: status.ACTIVE,
    });
    const agentCancelHotelBookingCount = await countTotalAgentHotelCancelled({
      status: status.ACTIVE,
    });
    const agentCancelFlightBookingCount = await countTotalAgentcancelFlightBookings(
      { status: status.ACTIVE }
    );
    const userCancelBusBookingCount = await countTotalBusCancelled({
      status: status.ACTIVE,
    });
    const userCancelHotelBookingCount = await countTotalHotelCancelled({
      status: status.ACTIVE,
    });
    const userCancelFlightBookingCount = await countTotalcancelFlightBookings({
      status: status.ACTIVE,
    });
    const userChangeBusBookingCount = await countChangeBusRequest({
      status: status.ACTIVE,
    });
    const userChangeHotelBookingCount = await countChangeHotelRequest({
      status: status.ACTIVE,
    });
    const userChangeFlightBookingCount = await countChangeFlightRequest({
      status: status.ACTIVE,
    });
    const agentChangeBusRequest = await countTotalchangeBusRequest({
      status: status.ACTIVE,
    });
    const agentChangeHotelRequest = await countTotalchangeHotelRequest({
      status: status.ACTIVE,
    });
    const agentChangeFlightRequest = await countTotalchangeRequest({
      status: status.ACTIVE,
    });
    result.NoOfHotelBookings = userHotelBooking + agentHotelBooking;
    result.NoOfFlightBookings = userFlightBooking + agentFlightBooking;
    result.NoOfBusBookings = userBusBooking + agentBusBooking;
    result.TotalBooking =
      result.NoOfHotelBookings +
      result.NoOfBusBookings +
      result.NoOfFlightBookings;
    result.NoOfSubAdmin = await countTotalSubAdmin({
      userType: userType.SUBADMIN,
    });
    result.NoOfUser = await countTotalUser({ userType: userType.USER });
    result.NoOfAgent = await countTotalbrbUser({ userType: userType.AGENT });
    result.totalCancelled =
      agentCancelBusBookingCount +
      agentCancelHotelBookingCount +
      agentCancelFlightBookingCount +
      userCancelBusBookingCount +
      userCancelHotelBookingCount +
      userCancelFlightBookingCount;
    result.totalChangeRequests =
      agentChangeBusRequest +
      agentChangeHotelRequest +
      agentChangeFlightRequest +
      userChangeBusBookingCount +
      userChangeHotelBookingCount +
      userChangeFlightBookingCount;
      result.TotalEventBooking = await countTotalBookingEvent({ status: status.ACTIVE });
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
};
//************GETALL BUSBOKING DETAILS****************/
exports.getAllBusBookingList = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
      {
        $lookup: {
          from: "userBtoC",
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
    let aggregate = userbusBookingModel.aggregate(pipeline);
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
    };
    const result = await userbusBookingModel.aggregatePaginate(
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
    console.log("Error in getAllBusBookingList:", error);
    return next(error);
  }
};
//*********GET SPECIFIC BOOKING DETAILS***************/
exports.getDataById = async (req, res, next) => {
  const { model, id } = req.query;
  let result;
  try {
    const isAdmin = await findUser({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    if (!isAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
    switch (model) {
      case "hotel":
        result = await findhotelBooking({ _id: id });
        break;
      case "flight":
        result = await flightModel.findOne({ _id: id });
        break;
      case "bus":
        result = await busBookingModel.findOne({ _id: id });
        break;
      case "user":
        result = await findUser({ _id: id });
        break;
      case "visa":
        result = await findWeeklyVisa({ _id: id });
        break;
      case "Agent":
        result = await findUser({ _id: id });
        break;
      default:
        return res.status(400).json({ message: responseMessage.INVALID_MODEL });
    }
    // console.log();
    if (!result) {
      return res.status(404).json({ message: responseMessage.DATA_NOT_FOUND });
    }

    return res
      .status(200)
      .json({ message: responseMessage.DATA_FOUND, data: result });
  } catch (error) {
    console.log("error =-=-=-=-=-=-=-=-=-=-=-=-=->>", error);
    return next(error);
  }
};
//******************CANCEL TICKET*****************/
exports.cancelTickets = async (req, res, next) => {
  try {
    const { model, ticketId } = req.body;
    const isAdmin = await findUser({
      _id: req.userId,
      userType: userType.ADMIN,
    });
    if (!isAdmin) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.ADMIN_NOT_FOUND });
    }

    switch (model) {
      case "hotel":
        const isBookingExist = await findhotelBooking({
          _id: ticketId,
          bookingStatus: bookingStatus.BOOKED,
        });
        if (!isBookingExist) {
          return res
            .status(statusCode.NotFound)
            .send({ message: responseMessage.DATA_NOT_FOUND });
        }
        if (isBookingExist.bookingStatus == bookingStatus.CANCEL) {
        }
        result = await updatehotelBooking(
          { _id: id },
          { bookingStatus: bookingStatus.CANCEL }
        );
        break;
      case "flight":
        result = await flightModel.findOne({ _id: id });
        break;
      case "bus":
        result = await busBookingModel.findOne({ _id: id });
        break;
      case "user":
        result = await findUser({ _id: id });
        break;
      case "visa":
        result = await findWeeklyVisa({ _id: id });
        break;
      case "Agent":
        result = await findUser({ _id: id });
        break;
      default:
        return res
          .status(statusCode.badRequest)
          .json({ message: responseMessage.INVALID_MODEL });
    }
  } catch (error) {
    console.log("error============>>>>>>", error);
    return next(error);
  }
};
//*************upload profile picture********************/
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    // const { picture } = req.body;
    const userList = await findUser({ _id: req.userId });
    if (!userList) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.USERS_NOT_FOUND });
    }
    const imageUrl = await commonFunction.getImageUrl(req.file);
    if (imageUrl) {
      const result = await updateUser(
        { _id: userList._id },
        { profilePic: imageUrl }
      );
      return res
        .status(statusCode.OK)
        .send({ message: responseMessage.DATA_FOUND, result: result });
    }
  } catch (error) {
    console.log("error====>>>", error);
    return next(error);
  }
};
//*********CANCEL HOTEL BOOKING AS PER USER REQUEST****************/
exports.cancelHotel = async (req, res, next) => {
  try {
    const { bookingID } = req.body;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const currentDate = new Date().toISOString();
    const isBookingExist = await findhotelBooking({
      _id: bookingID,
      status: status.ACTIVE,
      CheckInDate: { $gt: currentDate },
    });
    if (!isBookingExist) {
      return res
        .status(statusCode.NotFound)
        .send({ message: responseMessage.NOT_FOUND });
    }
    const result = await updatehotelBooking(
      { _id: isBookingExist._id },
      { bookingStatus: bookingStatus.CANCEL }
    );
    await commonFunction.sendHotelBookingCancelation(isBookingExist);
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.CANCELED, result: result });
  } catch (error) {
    console.log("error===========>>>.", error);
  }
};
//************GET ALL AGENT HOTEL BOOKING LIST ***************/
exports.getAllHotelBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const result = await aggregatePaginateHotelBookingList(req.query);
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
//**************GET ALL AGENT FLIGHT BOOKING LIST*************/
exports.getAllFlightBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "UserDetails",
        },
      },
      {
        $unwind: {
          path: "$Userb2bDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { flightName: { $regex: data, $options: "i" } },
            {
              "userDetails.personal_details.email": {
                $regex: data,
                $options: "i",
              },
            },
            {
              "userDetails.personal_details.first_name": {
                $regex: data,
                $options: "i",
              },
            },
            {
              "userDetails.personal_details.last_name": {
                $regex: data,
                $options: "i",
              },
            },
            { paymentStatus: { $regex: data, $options: "i" } },
            { pnr: parseInt(data) },
            { amount: parseInt(data) },
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
//************GET ALL AGENT BUSBOKING DETAILS****************/
exports.getAllBusBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
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
            {
              "userDetails.personal_details.email": {
                $regex: data,
                $options: "i",
              },
            },
            {
              "userDetails.personal_details.first_name": {
                $regex: data,
                $options: "i",
              },
            },
            {
              "userDetails.personal_details.last_name": {
                $regex: data,
                $options: "i",
              },
            },
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
//get all user cancel request*****************************************
exports.getCancelUserFlightBooking = async (req, res, next) => {
  try {
    // const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE, userType: userType.USER });
    // // console.log("isAgentExists", isAgentExists);
    // if (!isUserExist) {
    //   return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    // }
    // var userId = isUserExist._id;
    const { page, limit, search, fromDate } = req.query;
    const query = { page, limit, search, fromDate };
    const result = await aggregatePaginatecancelFlightBookingsList1(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error to get cancel flight", error);
    return next(error);
  }
};
exports.getCancelUserHotelBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate } = req.query;
    const result = await getHotelCancelRequesrByAggregate(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error to get cancel flight", error);
    return next(error);
  }
};
exports.getCancelUserBusBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate } = req.query;
    const result = await getBusCancelRequestByAggregate(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error", error);
    return next(error);
  }
};
//**************GET ALL AGENT Fix Departure BOOKING LIST*************/
exports.getAllFixDepartureBooking = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const aggregateQuery = [
      {
        $lookup: {
          from: "userb2bs",
          localField: "userId",
          foreignField: "_id",
          as: "UserDetails",
        },
      },
      {
        $unwind: {
          path: "$Userb2bDetails",
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
//get change flight booking details request by agent**********************************
exports.getAgentchangeFlightRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await aggregatePaginatechangeRequestList(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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
//get change hotel booking details request by agent**********************************
exports.getAgentchangeHotelRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;

    const result = await aggregatePaginatechangeHotelRequestList(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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
exports.getAgentchangeBusRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await aggregatePaginatechangeBusRequestList(req.query);
    // console.log(result);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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
//*************************************create Markup***********************************************/
exports.createMarkup = async (req, res, next) => {
  try {
    const { hotelMarkup, flightMarkup, busMarkup, packageMarkup,rechargeMarkup } = req.body;
    const object = {
      hotelMarkup: hotelMarkup,
      flightMarkup: flightMarkup,
      busMarkup: busMarkup,
      holidayPackageMarkup: packageMarkup,
      rechargeMarkup:rechargeMarkup
    };
    const data = await findMarkup({ status: status.ACTIVE });
    console.log("data", data);
    if (data) {
      const resultData = await updateMarkup({ _id: data._id }, object);
      if (!resultData) {
        return res
          .status(statusCode.NotFound)
          .send({
            statusCode: statusCode.NotFound,
            message: responseMessage.ADMIN_NOT_FOUND,
          });
      }
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.CREATED_SUCCESS,
          result: resultData,
        });
    } else {
      const result = await createMarkup(object);
      if (!result) {
        return res
          .status(statusCode.NotFound)
          .send({
            statusCode: statusCode.NotFound,
            message: responseMessage.ADMIN_NOT_FOUND,
          });
      }
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.CREATED_SUCCESS,
          result: result,
        });
    }
  } catch (error) {
    console.log("Error creating markup", error);
    return next(error);
  }
};
//***********************GET MARKUP*******************************************/
exports.getMarkup = async (req, res, next) => {
  try {
    const result = await markupList({});
    if (!result) {
      return res
        .status(statusCode.InternalError)
        .send({
          status: statusCode.InternalError,
          responseMessage: responseMessage.InternalError,
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
    console.log("Error: " + error);
    return next(error);
  }
};
//get all user cancel request*****************************************
exports.getCancelAgentFlightBooking = async (req, res, next) => {
  try {
    // const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE, userType: userType.USER });
    // // console.log("isAgentExists", isAgentExists);
    // if (!isUserExist) {
    //   return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    // }
    // var userId = isUserExist._id;
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await aggregatecancelFlightBookingsList(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error to get cancel flight", error);
    return next(error);
  }
};
exports.getCancelAgentHotelBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate } = req.query;
    const result = await getAgentHotelCancelRequesrByAggregate(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error to get cancel flight", error);
    return next(error);
  }
};
exports.getCancelAgentBusBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate } = req.query;
    const result = await getBusCancellationAgent(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
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
    console.log("error", error);
    return next(error);
  }
};
//get change flight booking details request by User**********************************
exports.getUserchangeFlightRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await flightchangeRequestUserList(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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
//get change hotel booking details request by User**********************************
exports.getUserchangeHotelRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;

    const result = await hotelchangeRequestUserList(req.query);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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
//get change bus booking details request by User**********************************
exports.getUserchangeBusRequest = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await buschangeRequestUserList(req.query);
    // console.log(result);
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
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

//************************************GET SEARCHHISTORY************************************************/
exports.getSearchHistory = async (req, res, next) => {
  try {
    const result = await userSearchList({});
    if (!result) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.BOOKING_NOT_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({ statusCode: statusCode.OK, result: result });
  } catch (error) {
    console.log("error in getting data=====>>>>>>>", error.message);
    return next(error);
  }
};

//**********************************************CREATE AGENTS********************************/
exports.createAgent = async (req, res, next) => {
  try {
    const { email, mobile_number, password, panNumber,agency_name,firstName,lastName } = req.body;
    // Check if pan_number is provided and not an empty string
    if (!panNumber || panNumber.trim() === "") {
      return res.status(statusCode.badRequest).send({
        statusCode: statusCode.badRequest,
        responseMessage: "PAN Number is required and cannot be empty.",
      });
    }
    // Hash the password
    const hashPass = bcrypt.hashSync(password, 10);
    const code=commonFunction.generateReferralCode();
    // Create the object with personal_details and agency_details including pan_number
    const object = {
      personal_details: {
        first_name:firstName,
        last_name:lastName,
        email: email,
        mobile: {
          mobile_number: mobile_number,
        },
        password: hashPass,
      },
      agency_details: {
        pan_number: panNumber.trim(),
        agency_name:agency_name
      },
      approveStatus: "APPROVED",
      isApproved:true,
      is_active: 1,
      referralCode:code
    };

    // Check if the user already exists based on email
    const isExist = await b2bUser.findOne({ "personal_details.email": email });
    if (isExist) {
      return res.status(statusCode.Conflict).send({
        statusCode: statusCode.Conflict,
        responseMessage: responseMessage.USER_ALREADY_EXIST,
      });
    }

    // Create the agent and handle the unique index constraint
    const result = await b2bUser.create(object);
    // Send welcome message
    const message = {
      email: email,
      password: password,
    };
    await sendSMS.sendSMSAgents(mobile_number, email);
    const msg = `Welcome to TheSkyTrails, Admin added you as an agent. Please use the following credentials to login and fill in the mandatory form:\nEmail: ${email}, and Password: ${password} .click here: ${process.env.AGENT_URL}`;
    // await whatsappAPIUrl.sendWhatsAppMessage(mobile_number, msg);
    await commonFunction.sendAgent(email, password);

    // Respond with success
    if (result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.CREATED_SUCCESS,
        result: result,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // req.query.userType==="USER"
    const result = await paginateUserSearch(req.query);
    if (!result || result.length <= 0) {
      res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.DATA_NOT_FOUND,
        });
    }
    res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.DATA_FOUND,
        result: result,
      });
  } catch (error) {
    console.log("error in getting all users", error);
    return next(error);
  }
};

exports.statusChange = async (req, res, next) => {
  try {
    const { userId, approveStatus } = req.body;
    const iSubAdminExist = await findSubAdmin({
      _id: userId,
    });
    if (!iSubAdminExist) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.SUBADMIN_NOT_EXIST,
        });
    }
    const updateData = await updateSubAdmin(
      { _id: iSubAdminExist._id },
      { status: approveStatus }
    );
      return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.SUBADMIN_UPDATED,result: updateData});
    
  } catch (error) {
    console.log("error in changeing subadmin status", error);
    return next(error);
  }
};

exports.updateMarkup = async (req, res, next) => {
  try {
    const {
      hotelMarkup,
      flightMarkup,
      busMarkup,
      holidayPackageMarkup,
      markupId,
    } = req.body;
    // const object = {
    //   hotelMarkup: hotelMarkup,
    //   flightMarkup: flightMarkup,
    //   busMarkup: busMarkup,
    //   holidayPackageMarkup: packageMarkup
    // }
    const result = await updateMarkup({ _id: markupId }, req.body);
    if (result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.CREATED_SUCCESS,
          result: result,
        });
    }
  } catch (error) {
    console.log("error while change markup", error);
    return next(error);
  }
};

exports.getAllEventBookings=async(req,res,next)=>{
  try {
    const { page, limit, search } = req.query;
    const result=await getEventPopulate(req.query);
    if(!result){
      return res.status(statusCode.OK).send({statusCode: statusCode.NotFound,responseMessage: responseMessage.DATA_NOT_FOUND});
    }
    return res.status(statusCode.OK).send({statusCode: statusCode.OK,responseMessage: responseMessage.DATA_FOUND,result: result});
  } catch (error) {
    console.log("error while trying to get all event booking list",error);
    return next(error);
  }
}

exports.createAppVersion=async(req,res,next)=>{
  try {
    const {iosVersion,androidVersion}=req.body;
    const obj={
      iosVersion:iosVersion,
      androidVersion:androidVersion
    }
    const isVersionExist=await findappVersion({});
    if(isVersionExist){
      const result=await updateappVersion({_id:isVersionExist._id},obj);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
    }
      
    
    
  } catch (error) {
    console.log("error while trying to add app version",error);
    return next(error);
  }
}

exports.getAppVersion=async(req,res,next)=>{
  try {
    const result=await findappVersion({});
    if(!result){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get version",error);
    return next(error)
  }
}

exports.distributeReward=async(req,res,next)=>{
  try {
    const {agentId,rewardPercentage}=req.body;
    const percentage=rewardPercentage||0.05
    const allAgents=[]
    const isAgentExist=await findOneAgent({_id:agentId,isApproved:true});
    if(!isAgentExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    const result={}
    result.agentId=isAgentExist._id;
    result.agentName=isAgentExist.personal_details.first_name+isAgentExist.personal_details.last_name;
    const agentflightBookings = await flightModel.find({ userId: isAgentExist._id });
      result.agentflightBookings = agentflightBookings.length;
      result.agentflightBookingRevenue = agentflightBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const agenthotelBookings = await hotelBookingModel.find({ userId: isAgentExist._id });
      result.agenthotelBookings = agenthotelBookings.length;
      result.agenthotelBookingRevenue = agenthotelBookings.reduce((acc, curr) => acc + curr.amount, 0);
      const agentbusBookings = await busBookingModel.find({ userId: isAgentExist._id });
      result.agentbusBookings = agentbusBookings.length;
      result.agentbusBookingRevenue = agentbusBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);
      result.totalRevenue = result.agentflightBookingRevenue + result.agenthotelBookingRevenue + result.agentbusBookingRevenue;
      allAgents.push(result);
    const findAgentRefferals=await findbrbData({referrerCode:isAgentExist.referralCode});
    for(const agents of findAgentRefferals){
      const obj={
        agentId:agents._id,
        agentName:agents.personal_details.first_name+agents.personal_details.last_name,
        flightBookings:0,
        flightBookingRevenue:0,
        hotelBookings:0,
        hotelBookingRevenue:0,
        busBookings:0,
        busBookingRevenue:0,
        totalRevenue:0
      }
      const flightBookings = await flightModel.find({ userId: agents._id });
      obj.flightBookings = flightBookings.length;
      obj.flightBookingRevenue = flightBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

      const hotelBookings = await hotelBookingModel.find({ userId: agents._id });
      obj.hotelBookings = hotelBookings.length;
      obj.hotelBookingRevenue = hotelBookings.reduce((acc, curr) => acc + curr.amount, 0);

      const busBookings = await busBookingModel.find({ userId: agents._id });
      obj.busBookings = busBookings.length;
      obj.busBookingRevenue = busBookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

      obj.totalRevenue = obj.flightBookingRevenue + obj.hotelBookingRevenue + obj.busBookingRevenue;

      allAgents.push(obj)
    }
    
    // Calculate the sum of totalRevenue for all agents
    const totalRevenueSum = allAgents.reduce((acc, agent) => acc + agent.totalRevenue, 0);
    if (totalRevenueSum > isAgentExist.revenue) {
      const rewardAmount = percentage * totalRevenueSum / 100;
      // Check if the agent already has an entry in the database for rewards
      const agentReward = await findAgentReward({ agentId: isAgentExist._id });
      let newObj;
      if (agentReward) {
          // If the agent already has an entry, update it
          const sendReward=rewardAmount-agentReward.rewardAmount;
          const sendRewarRevenue=totalRevenueSum-agentReward.revenue;
          // if(totalRevenueSum>agentReward.revenue){
            const updateReward = await updateAgentReward(
              { _id: agentReward._id },
              {
                  $set: { revenue: totalRevenueSum, rewardAmount: rewardAmount },
                  $push: { rewards: { revenue: sendRewarRevenue, rewardAmount: sendReward } }
              }
          );
          await updatebrbuser({_id:isAgentExist._id},{$set:{revenue: totalRevenueSum, rewardAmount: rewardAmount}});
          return res.status(statusCode.OK).send({
              statusCode: statusCode.OK,
              responseMessage: responseMessage.REWARD_DSTRIBUTED,
              result: updateReward,
          });
          // }
          return res.status(statusCode.OK).send({
            statusCode: statusCode.Conflict,
            responseMessage: responseMessage.ALREADY_REWARD_DSTRIBUTED,
        });
      } else {
          // If the agent doesn't have an entry, create a new one
          const history = { revenue: totalRevenueSum, rewardAmount: rewardAmount };
          newObj = { agentId: isAgentExist._id, rewardAmount: rewardAmount, revenue: totalRevenueSum, rewards: [history] };
          createReward = await createAgentReward(newObj);
          await updatebrbuser({_id:isAgentExist._id},{$set:{revenue: totalRevenueSum, rewardAmount: rewardAmount}});
          return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.DATA_FOUND,
            result: createReward,
        });
      }
      
  }
  return res.status(statusCode.OK).send({
    statusCode: statusCode.Conflict,
    responseMessage: responseMessage.No_REVENUE,
});
  } catch (error) {
    console.error("error while trying to distribute reward of agent");
    return next(error);
  }
}


exports.createReferralAmount = async (req, res, next) => {
  try {
    const { refereeAmount, referrerAmount } = req.body;

    // Check if there are any existing referral amounts
    const existingReferralAmount = await referralAmountList();
    
    // Create an object with the referral amount and/or referrer amount
    const obj = {};
    if (refereeAmount) {
      obj.refereeAmount = refereeAmount;
    }
    if (referrerAmount) {
      obj.referrerAmount = referrerAmount;
    }

    // If there are existing referral amounts, update the first one found
    if (existingReferralAmount.length > 0) {
      const update = await updateReferralAmount({}, obj); // Update the first referral amount found
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: update,
      });
    }

    // If no existing referral amounts, create a new one
    const result = await createReferralAmount(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to add or update referral amount:", error);
    return next(error);
  }
};

exports.getReferralAmount=async(req,res,next)=>{
  try {
    const result=await findReferralAmount({});
    if(!result){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get amount",error);
    return next(error);
  }
}

exports.createPackageBanner=async(req,res,next)=>{
  try {
    const {packageType,packageImage,packageTitle,packageDiscount,uniqueId}=req.body;
    // const isAdminExist = await adminModel.findOne({ _id: uniqueId });
    // if (!isAdminExist) {
    //   return res.status(statusCode.NotFound).send({
    //     statusCode: statusCode.NotFound,
    //     responseMessage: responseMessage.ADMIN_NOT_FOUND,
    //   });
    // }
    const imageUrl = await commonFunction.getImageUrlAWS(req.file);
    if (!imageUrl) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const obj={
      packageType:packageType,
      packageImage:imageUrl,
      packageTitle:packageTitle,
      packageDiscount:packageDiscount
    }
    const result=await createPackageBanner(obj);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create package banner", error);
    return next(error);
  }
}

exports.createPopularDestination=async(req,res,next)=>{
  try {
    const {city,images,description,discount,uniqueId}=req.body;
    // const isAdminExist = await adminModel.findOne({ _id: uniqueId });
    // if (!isAdminExist) {
    //   return res.status(statusCode.NotFound).send({
    //     statusCode: statusCode.NotFound,
    //     responseMessage: responseMessage.ADMIN_NOT_FOUND,
    //   });
    // }
    const imageUrl = await commonFunction.getImageUrlAWS(req.file);
    if (!imageUrl) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const obj={
      city:city,
      images:imageUrl,
      description:description,
      discount:discount
    }
    const result=await createPopularDestination(obj);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create package banner", error);
    return next(error);
  }
}

exports.updateStatusBanner=async(req,res,next)=>{
  try {
    const {status,bannerId}=req.body;
    const isBannerExist=await findPackageBanner({_id:bannerId});
    if(!isBannerExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BAD_REQUEST,
      });
    }
    const result=await updatePackageBanner({_id:isBannerExist._id},{status:status});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create package banner", error);
    return next(error);
  }
}
exports.updatePopularDestination=async(req,res,next)=>{
  try {
    const {status,destinationId}=req.body;
    const isdestinationExist=await findPopularDestination({_id:destinationId});
    if(!isdestinationExist){
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.BAD_REQUEST,
      });
    }
    const result=await updatePopularDestination({_id:isdestinationExist._id},{status:status});
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create package banner", error);
    return next(error);
  }
}

exports.createPackageCategory=async(req,res,next)=>{
  try {
    const {inclusion,colorCode,headingCode}=req.body;
    const imageUrl = await commonFunction.getImageUrlAWS(req.file);
    if (!imageUrl) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
  const obj={inclusion,images:imageUrl,colorCode,headingCode}
  const result=await createPackageCategory(obj);
  return res.status(statusCode.OK).send({
    statusCode: statusCode.OK,
    responseMessage: responseMessage.CREATED_SUCCESS,
    result: result,
  });
  } catch (error) {
    console.log("Error while trying to create package category", error);
    return next(error);
  }
  
}