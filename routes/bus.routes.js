const controller = require("../controllers/bus.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Bus City List
  app.post("/skyTrails/bus/citylist", controller.getBusCityList);

  //Bus Search
  app.post("/skyTrails/bus/search", controller.searchBus);

  //Bus Seat Layout
  app.post("/skyTrails/bus/seatlayout", controller.searchBusSeatLayout);

  //Bus Boarding Point
  app.post("/skyTrails/bus/boardingpoint", controller.busBoardingPoint);

  //Bus Block
  app.post("/skyTrails/bus/block", controller.busBlock);

  //Bus Book
  app.post("/skyTrails/bus/book", controller.busBook);

  //Bus Booking Details
  app.post("/skyTrails/bus/bookingdetails", controller.busBookingDetails);

  //Bus Cancel
  app.post("/skyTrails/bus/cancel", controller.busCancellation);
};
