const controller = require("../controllers/universaltransfer.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //country data
  app.post("/skytrails/transfer/staticData", controller.staticData);

  //get destination search static data
  app.post(
    "/skytrails/transfer/getdestinationsearchstaticdata",
    controller.getDestinationSearchStaticData
  );
 
//get transfer static data
  app.post(
    "/skytrails/transfer/GetTransferStaticData",
    controller.getTransferStaticData
  );

  //search transfer data
  app.post(
    "/skytrails/transfer/search",
    controller.transferSearch
  );

  //get cancellation policy
  
  app.post(
    "/skytrails/transfer/getcancellationpolicy",
    controller.getCancellationPolicy
  );



  //Transfer Booking
  app.post("/skytrails/transfer/booking", controller.transferBooking);


  //generate Voucher
  app.post(
    "/skytrails/transfer/generatevoucher",
    controller.generateVoucher
  );

  //Retrieve Booking details
  app.post(
    "/skytrails/transfer/retrievebookingdetails",
    controller.retrieveBookingDetails
  );

  //send change request
  app.post(
    "/skytrails/transfer/sendchangerequest",
    controller.sendChangeRequest
  );

  //get cancel request status
  app.post(
    "/skytrails/transfer/getcancleRequeststatus",
    controller.getcancelRequeststatus
  );
};
