const controller = require("../controllers/flight.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Airport Data
  app.get(
    "/skyTrails/getSearchAirportData/:key",
    controller.getSearchAirportData
  );
  app.post("/skyTrails/airportData", controller.airportData);

  //Token Generator
  app.post("/skyTrails/token", controller.tokenGenerator);

  //Logout
  app.post("/skyTrails/logout", controller.logout);

  //One Way Search
  app.post("/skyTrails/flight/search/oneway", controller.searchOneWay);

  //emt fligt search Routes------------------start

  app.post("/emt/flight/search/oneway", controller.onewaySearch);

  //-------------Two way flight Search-----------------------

  app.post("/emt/flight/search/twoway", controller.twowaySearch);

  app.post("/emt/flight/search/discount", controller.twowaySearch);

  //--------------END--------------

  //Return Search
  app.post("/skyTrails/flight/search/return", controller.searchReturn);

  //Multi City Search
  app.post("/skyTrails/flight/search/multicity", controller.searchMultiCity);

  //AdvanceSearch
  app.post("/skyTrails/flight/search/advance", controller.searchAdvance);

  //SpecialReturn Search
  app.post(
    "/skyTrails/flight/search/specialreturn",
    controller.searchSpecialReturn
  );

  //FareRule Search
  app.post("/skyTrails/flight/farerule", controller.fareRule);

  //FareQuote Search
  app.post("/skyTrails/flight/farequote", controller.fareQuote);

  //SSR Pending

  //Booking Non LCC FLights
  app.post("/skyTrails/flight/booking", controller.bookingFLight);

  //Booking EMT flights  Routes ---------------start--------

  app.post("/emt/flight/bookingRequest", controller.emtbookingFLightRequest);

  app.post("/GetSeatMap", controller.getSeatMap);

  app.post("/AirRePriceRQ", controller.emtFlightPrice);

  app.post("/BookFlight", controller.emtFlightBook);

  // app.get("/single/flight/combined/response",controller.combinedSearch);

  //Get Ticket LCC
  app.post("/skyTrails/flight/getticketlcc", controller.getTicketLCC);

  //Get Ticket Non LCC with passport
  app.post(
    "/skyTrails/flight/getticketnonlccpass",
    controller.getTicketNonLCCpass
  );

  //Get Ticket Non LCC without passport
  app.post("/skyTrails/flight/getticketnonlcc", controller.getTicketNonLCC);

  //GetBookingDetails Request-1 BookingId, PNR
  app.post("/skyTrails/flight/getbookingdetails", controller.getBookingDetails);

  //ReleasePNRRequest
  app.post(
    "/skyTrails/flight/releasepnrrequest",
    controller.getReleasePNRRequest
  );

  //SendChangeRequest
  app.post(
    "/skyTrails/flight/sendchangerequest",
    controller.getSendChangeRequest
  );

  //GetChangeRequestStatus
  app.post(
    "/skyTrails/flight/getchangerequeststatus",
    controller.getChangeRequestStatus
  );

  //GetCancellationCharges
  app.post(
    "/skyTrails/flight/getcancellationcharges",
    controller.getGetCancellationCharges
  );

  //twoapi merge
  app.post("/combinedApi", controller.combinedApi);


  // sorted data

  app.post("/sortedData", controller.sortedData);

  // return flight sort data

  app.post("/skyTrails/flight/retrun/sort", controller.returnFlightSort);
};


