const eventBookingControler=require('../../controllers/btocController/eventBookingControler');
const eventPromoBannerControler=require('../../controllers/btocController/eventPromoBannerController');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const upload=require('../../utilities/uploadHandler')
const { authJwt } = require("../../middleware");
const { Schemas } = require('aws-sdk');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload1 = multer({ storage: storage });


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/user/event/eventBookingControler',[authJwt.verifcationToken],SchemaValidator(schemas.eventBookingSchema), eventBookingControler.eventBooking);
    app.post('/skyTrails/api/user/event/bookFreeEvents',[authJwt.verifcationToken],SchemaValidator(schemas.eventBookingSchema), eventBookingControler.bookFreeEvents);
    app.post('/skyTrails/api/user/event/pefaBookFreeEvents',[authJwt.verifcationToken],SchemaValidator(schemas.eventBookingSchema),eventBookingControler.pefaEventBooking);
    app.post('/skyTrails/api/user/pushNotification',eventBookingControler.sendNotificationAfterBooking);
    app.get('/skyTrails/api/user/getEventBookingStatus',[authJwt.verifcationToken],eventBookingControler.getEventBookingStatus);
    app.put('/skyTrails/api/user/event/sendPassesUpdate',eventBookingControler.sendUpdatePasses);
    app.get('/skyTrails/api/user/event/getPromoBanner',eventPromoBannerControler.getPromotionalBanner);
}