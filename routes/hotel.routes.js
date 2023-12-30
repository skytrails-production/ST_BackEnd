const controller = require("../controllers/hotel.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Hotel Search De Dup
  app.post("/skyTrails/hotel/search/dedup", controller.searchHotelDeDup);

  //Hotel Search
  app.post("/skyTrails/hotel/search", controller.searchHotel);

  //Hotel Search Info De Duplicate
  app.post("/skyTrails/hotel/searchinfo/dedup", controller.searchHotelInfoDeDup);

  //Hotel Search Info
  app.post("/skyTrails/hotel/searchinfo", controller.searchHotelInfo);

  //Hotel Room
  app.post("/skyTrails/hotel/room", controller.searchHotelRoom);

  //Hotel Room De Duplicate
  app.post("/skyTrails/hotel/room/dedup", controller.searchHotelRoomDeDup);

  //Hotel Block Room
  app.post("/skyTrails/hotel/blockroom", controller.searchHotelBlockRoom);

  //Hotel Block Room De Duplicate
  app.post(
    "/skyTrails/hotel/blockroom/dedup",
    controller.searchHotelBlockRoomDeDup
  );

  //Hotel Book Room
  app.post("/skyTrails/hotel/bookroom", controller.searchHotelBookRoom);

  //Hotel Book Room De Duplicate
  app.post(
    "/skyTrails/hotel/bookroom/dedup",
    controller.searchHotelBookRoomDeDup
  );

  //Hotel Booking Details
  app.post(
    "/skyTrails/hotel/bookingdetails",
    controller.searchHotelBookingDetails
  );

  //Hotel Send Cancel Request
  app.post("/skyTrails/hotel/cancel", controller.hotelSendCancel);

  //Hotel Get Cancel Request Status
  app.post("/skyTrails/hotel/cancel/status", controller.hotelGetCancelStatus);

  //Hotel Get Cancel Request Status
  app.post(
    "/skyTrails/hotel/getagencybalance",
    controller.hotelGetAgencyBalance
  );

  //Hotel Country List
  app.post("/skyTrails/hotel/getcountrylist", controller.hotelGetCountryList);

  //Hotel Destination CityList
  app.post(
    "/skyTrails/getdestinationcitylist",
    controller.hotelGetDestinationCityList
  );

  //Hotel Top Destination List
  app.post(
    "/skyTrails/hotel/gettopdestinationlist",
    controller.hotelGetTopDestinationList
  );

  //Hotel Voucher
  app.post("/skyTrails/hotel/getvoucher", controller.hotelGetVoucher);
};
