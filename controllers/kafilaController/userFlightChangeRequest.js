const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const userType = require("../../enums/userType");
const sendSMSUtils = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const whatsApi = require("../../utilities/whatsApi");
const AdminNumber = process.env.ADMINNUMBER;
const bookingStatus = require("../../enums/bookingStatus");
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

const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  deleteUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
const {
  createUsertransaction,
  findUsertransaction,
  getUsertransaction,
  deleteUsertransaction,
  userUsertransactionList,
  updateUsertransaction,
  paginateUsertransaction,
  countTotalUsertransaction,
} = transactionModelServices;
const {
  KafilaCancellationServices,
} = require("../../services/kafilaServices/cancelBooking");
const {
  createKafilaCancelFlightBookings,
  findKafilaCancelFlightBookings,
  updateKafilacancelFlightBookings,
  aggrPagcancelFlightBookingsList,
  aggPagKafilaCancelFlightBookingsList1,
  countTotalKafilaCancelFlightBookings,
} = KafilaCancellationServices;
const {
  changeKafilaUserBookingServices,
} = require("../../services/kafilaServices/changeRequest");
const {
  createKafilaUserFlightChangeRequest,
  aggrPagchangeFlightBookingsList,
  flightKafilachangeRequestUserList,
  flightKafilaChangeRequestById,
  kafilaFindOneChangeRequestDetail,
  countKafilaChangeFlightRequest,
} = changeKafilaUserBookingServices;
const {
  userKafilaFlightBookingServices,
} = require("../../services/kafilaServices/flightBookingServices");
const {
  createKafilaFlightBooking,
  findKafilaFlightBooking,
  getKafilaFlightBookings,
  deleteKafilaFlightBooking,
  updateKafilaFlightBooking,
  paginateKafilaFlightBookingSearch,
  countTotalKafilaFlightBookings,
  aggPagGetBookingList,
  aggrPagGetKafBookingAdmin,
} = userKafilaFlightBookingServices;
//**********************************************************API's**********************************************/
exports.ChangeFlightBookingReq = async (req, res, next) => {
  try {
    const {
      reason,
      bookingId,
      flightBookingId,
      contactNumber,
      changerequest,
      pnr,
    } = req.body;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
      userType: userType.USER,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
    }
    const currentDate = new Date().toISOString();
    const isBookingExist = await findKafilaFlightBooking({
      userId: isUserExist._id,
      bookingId: bookingId,
      _id: flightBookingId,
      status: status.ACTIVE,
    });
    if (!isBookingExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.BOOKING_NOT_FOUND,
        });
    } else if (isBookingExist.airlineDetails[0].Origin.DepTime <= currentDate) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.badRequest,
          responseMessage: responseMessage.CHANGE_NOT_ALLOW,
        });
    }
    const isAlreadyRequested = await kafilaFindOneChangeRequestDetail({
      userId: isUserExist._id,
      flightBookingId: isBookingExist._id,
    });
    if (isAlreadyRequested) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.Conflict,
          responseMessage: responseMessage.ALREADY_CHANGE_REQUESTED,
        });
    }
    const isCancelRequestAlreadyExist = await findKafilaCancelFlightBookings({
      userId: isUserExist._id,
      flightBookingId: isBookingExist._id,
    });
    if (isCancelRequestAlreadyExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.Conflict,
          responseMessage: responseMessage.ALREADY_REQUESTED,
        });
    }
    const object = {
      userId: isUserExist._id,
      reason: reason,
      flightBookingId: flightBookingId,
      bookingId: bookingId,
      pnr: pnr,
      contactNumber: contactNumber,
      changerequest: changerequest,
      amount: isBookingExist.totalAmount,
    };
    const result = await createKafilaUserFlightChangeRequest(object);
    const notObject = {
      userId: isUserExist._id,
      title: "Booking Change Request by User",
      description: `New Change ticket request form user on our platform🎊.😒`,
      from: "FlightChangeRequest",
      to: isUserExist.userName,
    };
    await createPushNotification(notObject);
    const TemplateNames = [
      String("FLightTicket Change"),
      String("change details"),
      String(isUserExist.username),
      String("formattedDate"),
    ];
    const adminContact=[process.env.ADMINNUMBER1,process.env.ADMINNUMBER2,process.env.ADMINNUMBER,process.env.ADMINNUMBER3,process.env.ADMINNUMBER4];
    await whatsApi.sendWhtsAppAISensyMultiUSer(
      adminContact,
      TemplateNames,
      "admin_booking_Alert"
    );
    if (result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.CHANGE_REQUEST_SUCCESS,
          result: result,
        });
    }
  } catch (error) {
    return next(error);
  }
};

exports.getUserChangeFlights = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
      otpVerified: true,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
    }
    req.query.userId = isUserExist._id;
    const result = await aggrPagchangeFlightBookingsList(req.query);
    if (!result) {
      return res
        .status(statusCode.OK)
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
    return next(error);
  }
};

exports.getChangeFlightIdOfUserById = async (req, res, next) => {
  try {
    const { changeReqId } = req.query;
    const result = await flightKafilaChangeRequestById({ _id: changeReqId });
    if (!result) {
      return res
        .status(statusCode.OK)
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
    return next(error);
  }
};

exports.getAllUserChangeFlight = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const result = await flightKafilachangeRequestUserList(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
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
    console.log("error while trying to get userFlight booking! ", error);
    return next(error);
  }
};

