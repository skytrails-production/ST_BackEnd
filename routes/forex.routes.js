const controller = require("../controllers/forex.controllers");


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/skyTrails/forex/createForex',controller.createForex);
    app.get('/skyTrails/forex/getAllForex',controller.getAllForex);
    app.delete('/skyTrails/forex/deleteForex',controller.deleteForex);
    app.post('/skyTrails/forex/createCustomerforex',controller.createCustomerforex);
    app.get('/skyTrails/forex/getAllCustomerforex',controller.getAllCustomerforex);
    app.delete('/skyTrails/forex/deleteCustomerforex',controller.deleteCustomerforex);
}