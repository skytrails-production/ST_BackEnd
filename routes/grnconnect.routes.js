const controller = require("../controllers/grnconnect.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
    
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });



    app.get("/skyTrails/grnconnect/getcityList", controller.getCityListData);
    app.get('/skyTrails/updateCities', controller.updateCityListWithCountryNames);
    app.get('/skyTrails/grnconnect/getcountrylist',controller.getCountryList);

    app.post("/skyTrails/grnconnect/hotelsearch",controller.hotelSearch);
    app.post("/skyTrails/grnconnect/singlehotelsearch", controller.singleHotelSearch);
    app.post("/skyTrails/grnconnect/hotelSearchWithPagination",controller.hotelSearchWithPagination);
    
    app.post("/skyTrails/grnconnect/searchmultihotel", controller.searchMulitHotel);
    
    app.get("/skyTrails/grnconnect/refetchHotel", controller.refetchHotel);
    app.post("/skyTrails/grnconnect/rateRefetchHotel", controller.rateRefetchHotel);

    app.post("/skyTrails/grnconnect/bundledrates", controller.bundledRates);

    app.get("/skyTrails/grnconnect/hotelimages",controller.hotelImages);

    app.post("/skyTrails/grnconnect/hotelbooking",controller.hotelBooking);

    app.get("/skyTrails/grnconnect/hotelfetchbooking", controller.hotelFetchBooking);


    app.delete("/skyTrails/grnconnect/hotelcancelbooking",controller.hotelCancelBooking);



    //agent booking system
    app.post("/skyTrails/grnconnect/addhotelBooking", controller.addHotelBooking);


    //get grn agent booking all by agent id
    app.get("/skyTrails/agent/getallgrnbooking", controller.getAllAgentBooking);
    //get grn agent single booking by booking id
    app.get("/skyTrails/agent/getgrnbookingbyid",controller.getGrnAgentSingleBooking);


    //get city and hotel 

    app.get("/skyTrails/grnconnect/searchcityandhotel",controller.getCityAndHotelSearch);

    app.post("/skyTrails/grnconnect/hotelsearchwhc",controller.hotelSearchWithCode);


    //search hotel by hotel name

    app.get("/skyTrails/grnconnect/searchhotelbyname",controller.searchHotelByName);


    //hotel searchby location name

    app.get("/skyTrails/grnconnect/locationamelist",controller.getAllhotelLocationName);

    
}
