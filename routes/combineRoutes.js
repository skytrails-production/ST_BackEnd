const combineApiController= require("../controllers/combinedApiResponse");
const combineBookingDetailsCOntroller=require('../controllers/combineAPIS/combineUserBookings');
const combineOffer= require("../controllers/combineAPIS/combineOffer");
const multer = require("multer");
// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authJwt } = require("../middleware");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });


  app.post("/skyTrails/api/combine/combineApiRes", combineApiController.combineTvoKafila);//get category
  app.get('/skyTrails/api/amadeus/user/getCombineBookingHistory',[authJwt.verifcationToken],combineBookingDetailsCOntroller.getAmadeusTvo);
  app.get('/skyTrails/api/user/getCombineHotelBookingHistory',[authJwt.verifcationToken],combineBookingDetailsCOntroller.getCombineHotelBookingList);
  app.post("/skyTrails/api/combine/combineRoundTripApiRes", combineApiController.combineTvoKafilaRoundTrip);
  app.get('/skyTrails/api/amadeus/user/getAllBookingHistory',[authJwt.verifcationToken],combineBookingDetailsCOntroller.getCombineFlightBookingResp);
  app.get('/skyTrails/api/amadeus/user/combine/getAllBookingHistoryAggregate',[authJwt.verifcationToken],combineBookingDetailsCOntroller.getCombineFlightBookingRespAggregate);
  app.get('/skyTrails/api/combine/combieOffers',combineOffer.getCombineOffer);
  app.get('/skyTrails/api/combine/combieOffers/:id',combineOffer.getOfferById)


};
