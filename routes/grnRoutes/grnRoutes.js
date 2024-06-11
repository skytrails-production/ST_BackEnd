const Controller=require('../../controllers/grnHotelBookingController/userGrnHotelBookingController')
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
    app.post('/skyTrails/api/grn/user/grnBookig',[authJwt.verifcationToken], Controller.grnHotelBooking);
    // app.get('/skyTrails/api/grn/user/getflightBooking',[authJwt.verifcationToken],Controller.getUserFlightBooking);
    // app.get('/skyTrails/api/grn/user/getflightBookingById',Controller.getFlightBookingId);
    // app.get('/skyTrails/api/grn/user/getAllflightBooking',Controller.getAllUserFlightBooking);
    // app.put('/skyTrails/api/grn/user/UpdateTicket',Controller.UpdateTicket)
}
