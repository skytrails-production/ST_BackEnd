const controller = require("../controllers/kafila.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  
  //Token Generator
  app.get("/skyTrails/api/kafila/token", controller.kafilaTokenGenerator);
  app.post("/skyTrails/api/kafila/kafilaFareCheck", controller.kafilaFareCheck);
  app.post("/skyTrails/api/kafila/kafilaSSR", controller.kafilaSSR);
  app.post("/skyTrails/api/kafila/kafilaPnrcreation", controller.kafilaPnrcreation);
  app.post("/skyTrails/api/kafila/kafilaFlightSearch", controller.kafilaFlightSearch);
  app.post("/skyTrails/api/kafila/kafilaRoundTripFlightSearch", controller.kafilaRoundTripFlightSearch);
  app.post("/skyTrails/api/kafila/kafilaGetBookingDetails", controller.kafilaGetBookingDetails);
};


