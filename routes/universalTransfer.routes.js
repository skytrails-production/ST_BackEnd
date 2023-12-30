const controller = require("../controllers/universaltransfer.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/skyTrails/universaltransfer/staticData", controller.staticData);
  app.post(
    "/skyTrails/universaltransfer/GetDestinationSearchStaticDatacitywise",
    controller.GetDestinationSearchStaticDatacitywise
  );
  app.post(
    "/skyTrails/universaltransfer/GetDestinationSearchStaticDataHotelwise",
    controller.GetDestinationSearchStaticDataHotelwise
  );
  app.post(
    "/skyTrails/universaltransfer/GetTransferStaticData",
    controller.GetTransferStaticData
  );
  app.post(
    "/skyTrails/universaltransfer/transfersearch",
    controller.transfersearch
  );
  app.post(
    "/skyTrails/universaltransfer/GetCancellationPolicy",
    controller.GetCancellationPolicy
  );
  app.post("/skyTrails/universaltransfer/booking", controller.booking);
  app.post(
    "/skyTrails/universaltransfer/GenerateVoucher",
    controller.GenerateVoucher
  );
  app.post(
    "/skyTrails/universaltransfer/retrieveBookingDetails",
    controller.retrieveBookingDetails
  );
  app.post(
    "/skyTrails/universaltransfer/SendChangeRequest",
    controller.SendChangeRequest
  );
  app.post(
    "/skyTrails/universaltransfer/getcancleRequeststatus",
    controller.getcancleRequeststatus
  );
};
