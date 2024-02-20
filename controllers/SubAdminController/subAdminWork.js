const config = require("../../config/auth.config");
const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const approvestatus = require("../../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../../utilities/responceCode");
const responseMessage = require("../../utilities/responses");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsappAPIUrl = require("../../utilities/whatsApi");
const approvalStatus = require("../../enums/approveStatus");
//***********************************SERVICES********************************************** */
const adminModel=require("../../model/user.model")
const { userServices } = require("../../services/userServices");
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
} = userServices;
const { subAdminServices } = require("../../services/subAdminServices");
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
const {
  advertisementServices,
} = require("../../services/btocServices/advertisementServices");
const {
  createadvertisement,
  findadvertisementData,
  deleteadvertisement,
  advertisementList,
  updateadvertisement,
  countTotaladvertisement,
  getAdvertisment,
} = advertisementServices;
const {
  webAdvertisementServices,
} = require("../../services/btocServices/webUserOfferServices");
const {
  createWebadvertisement,
  findWebadvertisementData,
  deletWebeadvertisement,
  webAdvertisementList,
  updateWebadvertisement,
  countTotalWebadvertisement,
  getWebAdvertisment,
} = webAdvertisementServices;

//***************************API task of subAmdin operation for TheSkyTrails************************************* */
