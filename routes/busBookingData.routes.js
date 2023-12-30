const controller = require("../controllers/busBookingData.controllers");
const schemas = require("../utilities/schema.utilities");
const SchemaValidator = require("../utilities/validations.utilities");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post(
  //   "/skyTrails/busBooking/addBusBookingData",
  //   SchemaValidator(schemas.busBookingSchema),
  //   controller.addBusBookingData
  // );

  app.post(
    "/skyTrails/busBooking/addBusBookingData", controller.addBusBookingData);

  // Get All Bus Boooking list for Admin

  app.post(
    "/skyTrails/getAllBusBookingForAdmin",
    controller.getAllBusBookingdataForAdmin
  );
  app.get('/skyTrails/BusBooking/getoneBusBookingById/:id',controller.getoneBusBookingById);

  app.post('/skyTrails/bus/emailTicket', controller.emailTicket);
};
