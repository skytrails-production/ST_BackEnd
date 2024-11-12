const controller = require("../controllers/city.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/skyTrails/city/addData',controller.addData);searchCityBusData
  app.get("/skyTrails/city/searchCityData", controller.searchCityData);
  app.get("/skyTrails/city/searchCityBusData", controller.searchCityBusData);
  app.post("/skyTrails/city/hotelCitySearch", controller.hotelCitySearch);

  app.post("/skyTrails/busCity",controller.cityBusProductionData);

  //flight all city data 
  app.get("/skyTrails/searchCity", controller.searchCityFlight);

  app.get("/skyTrails/airline",controller.airlineDetails);
  app.get("/skyTrails/airlineName",controller.getAirlineDetailsById);
};
