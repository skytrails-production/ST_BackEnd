const dayWiseController=require('../../controllers/Itinerary/createDayWiseItinerary');
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
    // app.post('/skyTrails/api/grn/user/grnBookig',[authJwt.verifcationToken], Controller.grnUserHotelBooking);
    // app.get('/skyTrails/api/grn/user/grnUserBooking',[auth/Jwt.verifcationToken],Controller.getUserGrnBooking);
    // app.get('/skyTrails/api/grn/user/getUserBookingById',[authJwt.verifcationToken],Controller.getUserGrnBookingById);
    app.get('/skyTrails/api/itinerary/dayWise/createDayWise',dayWiseController.createDayWiseActivity);
    // app.put('/skyTrails/api/grn/user/UpdateTicket',Controller.UpdateTicket)
    // app.post('/skyTrails/api/grn/user/cancel/createCancelRequest',[authJwt.verifcationToken],cancelCoontroller.createUserGrnCancelRequest);
    // app.put('/skyTrails/api/grn/admin/cancel/updateCancelRequestStatus',SchemaValidator(schemas.cancelStatusUpdation),cancelCoontroller.updateCancellation);
    
}
