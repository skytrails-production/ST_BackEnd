const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const crypto = require("crypto");
const axios = require("axios");
const merchant_id = process.env.CC_AVENUE_MERCHANT_ID;
const salt_key = process.env.PHONE_PAY_SALT_KEY;
const paymentStatus = require("../../enums/paymentStatus");
const { URLSearchParams } = require("url");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const client_secret = process.env.CASHFREE_API_KEY;
const clientId = process.env.CASHFREE_API_ID;
// const Cashfree=require("cashfree-pg");

// Cashfree.XClientId = process.env.CASHFREE_API_ID;
// Cashfree.XClientSecret = process.env.CASHFREE_API_KEY;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
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
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const sendSMSUtils = require("../../utilities/sendSms");
const { responseMessages } = require("../../common/const");

const {userWalletHistoryServices}=require("../../services/btocServices/userWalletHistoryServices");
const {createUserWalletHistory,findUserWalletHistory,deleteUserWalletHistory,userWalletHistoryList,updateUserWalletHistory,countTotalUserWalletHistory}=userWalletHistoryServices