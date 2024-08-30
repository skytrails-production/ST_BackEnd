const controller = require("../controllers/amadeus.controller");
const combinedController=require('../controllers/combinedApiResponse')
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post("/skyTrails/amadeus/fareMasterPricerTravelBoardSearch",controller.fareMasterPricerTravelBoardSearch);
    
    
    app.post("/skyTrails/api/combinedApi",combinedController.cobinedAsPerPrice);
    app.post("/skyTrails/amadeus/combineResponse",combinedController.combineTVOAMADEUS);
    app.post("/skytrails/api/combined/combineTVOAMADEUSPriceSort",combinedController.combineTVOAMADEUSPriceSort);   
    app.post("/skytrails/api/combined/combineTVOAMADEUSReturn",combinedController.combineTvoAmadeusReturn);   
    app.post("/skytrails/api/combined/AMADEUSPriceSort",combinedController.AMADEUSPriceSort);   

    app.post("/skytrails/api/combined/combineTVOAMADEUSOptimised",combinedController.combineTVOAMADEUSOptimised);   

    //new routes  fareInformative price to  fareRule start or end
    app.post("/skyTrails/amadeus/fareInformativePricingWithoutPNR",controller.fareInformativePricingWithoutPNR);
    app.post("/skyTrails/amadeus/farecheckrule",controller.fareCheckRule);
    app.post("/skyTrails/amadeus/farecheckrule2", controller.fareCheckRuleSecond);

    //new routes  air sell to pnr
    app.post("/skyTrails/amadeus/airsell",controller.airSell);
    app.post("/skyTrails/amadeus/pnraddmultielements", controller.pnrAddMultiElements);
    app.post("/skyTrails/amadeus/farepricepnrwithbookingclass", controller.farePricePnrWithBookingClass);
    app.post("/skyTrails/amadeus/ticketcreatetstfrompricing", controller.ticketCreateTSTFromPricing);
    app.post("/skyTrails/amadeus/savepnr",controller.savePnrAddMultiElements);



    //PNR RETRIEVE
    app.post("/skyTrails/amadeus/pnrretrieve",controller.pnrRetrieve);



    //Air_RetrieveSeatMap stateless

    app.post("/skyTrails/amadeus/airretrieveseatmap", controller.airRetrieveSeatMap);
    
    //pnr retrieve inseries
    app.post("/skyTrails/amadeus/pnrret",controller.pnrRet);



    //sign out route
    app.post("/skyTrails/amadeus/signout",controller.signOut);


  
  }