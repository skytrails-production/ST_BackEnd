const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const couponModel = require("../../model/btocModel/couponModel");
//*****************************************SERVICES************************************************/
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
  flightadvertisementServices,
} = require("../../services/btocServices/flightAdvertismentServices");
const {
  createflightadvertisement,
  findflightadvertisementData,
  deleteflightadvertisement,
  advertisementflightList,
  updateflightadvertisement,
  countTotalflightadvertisement,
  getflightAdvertisment,
} = flightadvertisementServices;
const {
  hoteladvertisementServices,
} = require("../../services/btocServices/hotelAdvertisementServices");
const {
  createhoteladvertisement,
  findhoteladvertisementData,
  deletehoteladvertisement,
  hoteladvertisementList,
  updatehoteladvertisement,
  countTotalhoteladvertisement,
  gethotelAdvertisment,
} = hoteladvertisementServices;
const {
  busadvertisementServices,
} = require("../../services/btocServices/busAdvertiseMentServices");
const {
  createbusadvertisement,
  findbusadvertisementData,
  deletebusadvertisement,
  advertisementbusList,
  updatebusadvertisement,
  countbusTotaladvertisement,
  getbusAdvertisment,
} = busadvertisementServices;
const {
  couponServices,
} = require("../../services/btocServices/couponServices");
const {
  createCoupon,
  findCoupon,
  getCoupon,
  findCouponData,
  deleteCoupon,
  couponList,
  updateCoupon,
  paginateCouponSearch,
} = couponServices;

exports.createCoupons = async (req, res, next) => {
  try {
    const {
      title,
      content,
      remainingDays,
      couponCode,
      discountPercentage,
      limitAmount,
      expirationDate,
      termsAndCond,
      offerType,
      uniqueId,
    } = req.body;
    const isAdminExist = await findUser({ _id: uniqueId });
    if (!isAdminExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.ADMIN_NOT_FOUND,
      });
    }
    const imageUrl = await commonFunction.getImageUrlAWS(req.file);
    req.body.image = imageUrl;
    if (!imageUrl) {
      return res.status(statusCode.InternalError).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.INTERNAL_ERROR,
      });
    }
    const isCouponExist = await findCoupon({
      couponCode: couponCode,
      status: status.ACTIVE,
    });

    if (isCouponExist) {
      const update = await createCoupon({ _id: isCouponExist._id }, req.body);
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.CREATED_SUCCESS,
        result: update,
      });
    }
    const newCoupon = await createCoupon(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: newCoupon,
    });
  } catch (error) {
    console.error("error while trying to create error", error);
    return next(error);
  }
};

exports.getAllCoupons = async (req, res, next) => {
  try {
    const result = await findCouponData({ status: status.ACTIVE });
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
    console.error("error while trying to get coupons", error);
    return next(error);
  }
};

exports.getCouponById = async (req, res, next) => {
  try {
    const result = await findCoupon({_id: req.query.couponId,status: status.ACTIVE});
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
    console.log("error while trying to get coupon data", error);
    return next(error);
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    let couponUser = [];
    const isUserExist = await findUserData({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.USERS_NOT_FOUND,
      });
    }
    const isCouponExist = await findCoupon({ couponCode: couponCode });
    console.log("isCouponExist==========",isCouponExist);
    if (!isCouponExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.COUPON_NOT_FOUND,
      });
    }
    // Check if the coupon is already expired
    const currentDateTime = new Date();
    console.log("currentDateTime.expirationDate========",currentDateTime);
    console.log(
      "currentDateTime > coupon.expirationDate=====================",
      currentDateTime > isCouponExist.expirationDate
    );
    if (currentDateTime > isCouponExist.expirationDate.getTime()) {
      return res.status(statusCode.badRequest).send({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.COUPON_EXPIRED,
      });
    }
    console.log("isCouponExist.userApplied.includes(isUserExist._id)===========",isCouponExist.userApplied.includes(isUserExist._id));
    // Check if the user has already applied the coupon
    if (isCouponExist.userApplied.includes(isUserExist._id)) {
      return res.status(statusCode.badRequest).json({
        statusCode: statusCode.badRequest,
        responseMessage: responseMessage.ALREDY_COUPOUN_APPLIED,
      });
    }
    console.log("coupon=>>", couponUser);
    console.log("coupon.userApplied============", couponUser.userApplied);
    // Apply the coupon by updating the userApplied array
    couponUser.push(userId);
    // Update the coupon in the database
    await findCouponByIdAndUpdate(coupon._id, {
      userApplied: couponUser,
    });
    return res
      .status(statusCode.OK)
      .json({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.COUPON_APPLIED_SUCCESS,
      });
  } catch (error) {
    console.log("error while trying to apply coupon", error);
    return next(error);
  }
};
