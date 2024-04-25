const controller = require("../controllers/amadeus.controller");
const combinedController=require('../controllers/combinedApiResponse')
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post("/skyTrails/amadeus/fareMasterPricerTravelBoardSearch",controller.fareMasterPricerTravelBoardSearch);
    app.post("/skyTrails/amadeus/fareInformativePricingWithoutPNR",controller.fareInformativePricingWithoutPNR);
    app.post("/skyTrails/amadeus/airSellFromRecommendation",controller.airSellFromRecommendation);
    app.post("/skyTrails/api/combinedApi",combinedController.cobinedAsPerPrice);
    app.post("/skyTrails/amadeus/combineResponse",combinedController.combineTVOAMADEUS);
    app.post("/skytrails/api/combined/combineTVOAMADEUSPriceSort",combinedController.combineTVOAMADEUSPriceSort);   

    //new routes 
    app.post("/skyTrails/amadeus/airsell",controller.airSell);


  
  }