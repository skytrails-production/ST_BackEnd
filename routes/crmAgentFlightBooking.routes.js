const controller = require('../controllers/crmAgentFlightBooking.controller');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post('/skytrails/crmagent/flightbooking/create', controller.createCrmAgentFllghtBooking);

    app.get('/skytrails/crmagent/flightbooking/single/:id', controller.getAgentSingleFlightBooking);


    app.get('/skytrails/crmagent/flightbookings', controller.getAgentFlightBookingDataWithPagination);


}