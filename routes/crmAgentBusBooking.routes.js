const controller = require('../controllers/crmAgentBusBooking.controller');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });

    app.post('/skytrails/crmagent/busbooking/create', controller.createCrmAgentBusBooking);

    app.get('/skytrails/crmagent/busbooking/:id', controller.getAgentSingleBusBooking);


    app.get('/skytrails/crmagent/busbookings', controller.getAgentBusBookingDataWithPagination);


}