const Controller=require('../../controllers/amadeusController/amadeusBookingController')
const amadeusCancelController=require('../../controllers/amadeusController/amadeusCancelRequest')
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
// const upload=require('../../utilities/uploadHandler')
const { authJwt } = require("../../middleware");
const { Schemas } = require('aws-sdk');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/amadeus/user/flightBooking',[authJwt.verifcationToken], Controller.amdsFlightBooking);
    app.get('/skyTrails/api/amadeus/user/getflightBooking',[authJwt.verifcationToken],Controller.getUserFlightBooking);
    app.get('/skyTrails/api/amadeus/user/getflightBookingById',Controller.getFlightBookingId);
    app.get('/skyTrails/api/amadeus/user/getAllflightBooking',Controller.getAllUserFlightBooking);
    app.put('/skyTrails/api/amadeus/user/UpdateTicket',Controller.UpdateTicket);
    app.put('/skyTrails/api/amadeus/user/generatePdfOfUSer',Controller.generatePdfOfUSer);
    app.post('/skyTrails/api/amadeus/user/amadeusCancelUserFlightBooking',[authJwt.verifcationToken],amadeusCancelController.cancelUserFlightTicket)
}
