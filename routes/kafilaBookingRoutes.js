const controller = require("../controllers/kafilaController/userFlightBookingController");
const cancelController = require("../controllers/kafilaController/userFlightCancelRequest");
const changeController = require("../controllers/kafilaController/userFlightChangeRequest");
const schemas = require("../utilities/schema.utilities");
const SchemaValidator = require("../utilities/validations.utilities");
// const upload=require('../../utilities/uploadHandler')
const { authJwt } = require("../middleware");
const { Schemas } = require("aws-sdk");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Token Generator
  app.post(
    "/skyTrails/api/user/kafila/userFlightBookingData",
    [authJwt.verifcationToken],
    controller.userFlightBooking
  );
  app.get(
    "/skyTrails/api/user/kafila/getUserFlightBooking",
    [authJwt.verifcationToken],
    controller.getUserFlightBooking
  );
  app.get(
    "/skyTrails/api/user/kafila/getUserFlightBookingData",
    [authJwt.verifcationToken],
    controller.getUserFlightData
  );
  app.get(
    "/skyTrails/api/admin/kafila/getUserFlightBookings",
    controller.getUserFlightBookings
  );
  app.post(
    "/skyTrails/api/user/kafila/cancelKafilaFlightBooking",
    [authJwt.verifcationToken],
    cancelController.cancelUserFlightTicket
  );
  app.get(
    "/skyTrails/api/user/kafila/getBookingById",
    [authJwt.verifcationToken],
    cancelController.getUserCancelFlights
  );
  app.get(
    "/skyTrails/api/user/kafila/getCancelReqById",
    cancelController.getCancelFlightBookingId
  );
  app.post(
    "/skyTrails/api/user/kafila/changeKafilaFlightBooking",
    [authJwt.verifcationToken],
    changeController.ChangeFlightBookingReq
  );
  app.get(
    "/skyTrails/api/user/kafila/getchangeRequestData",
    [authJwt.verifcationToken],
    changeController.getUserChangeFlights
  );
  app.get(
    "/skyTrails/api/user/kafila/getchangeRequestById",
    changeController.getChangeFlightIdOfUserById
  );
  app.get(
    "/skyTrails/api/admin/kafila/getAllChangeRequest",
    changeController.getAllUserChangeFlight
  );
  app.get(
    "/skyTrails/api/admin/kafila/getAllCancelRequest",
    cancelController.getAllUserCancelFlight
  );
};
