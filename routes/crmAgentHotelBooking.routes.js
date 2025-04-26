const controller = require("../controllers/crmAgentHotelBooking.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/skytrails/crmagent/hotelbooking/create",
    controller.createCrmAgentHotelBooking
  );

  app.get(
    "/skytrails/crmagent/hotelbooking/single/:id",
    controller.getAgentSingleHotelBooking
  );

  app.get(
    "/skytrails/crmagent/hotelbookings",
    controller.getAgentHotelBookingDataWithPagination
  );
};
