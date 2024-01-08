const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const Razorpay = require("razorpay");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const crypto = require("crypto");
//razor pay instance******************************************
let instance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID,
  key_secret: process.env.Razorpay_KEY_SECRET,
});

/**********************************SERVICES********************************** */
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
  userSerachesServices,
} = require("../../services/btocServices/userSearchServices");
const {
  createUserSearch,
  findUserSearch,
  getUserSearch,
  deleteUserSearch,
  userSearchList,
  updateUserSearch,
  paginateUserSearchHistory
} = userSerachesServices;

exports.createSearchHistory = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      journeyType,
      searchType,
      journeyDate,
      cityName,
      checkin,
      checkout,
      rooms,
      days,
    } = req.body;
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
    req.body.userId = isUserExist._id;
    const result = await createUserSearch(req.body);
    res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error in creating search request===>>", error);
    return next(error);
  }
};

exports.getUserSerchHistory = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await paginateUserSearchHistory(req.query);
    if (!result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get data", error);
    return next(error);
  }
};
