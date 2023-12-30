const controller = require('../controllers/hotelBokkingdata.controller');
const schemas = require('../utilities/schema.utilities');
const SchemaValidator = require('../utilities/validations.utilities');
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post('/skyTrails/hotelBooking/addHotelBookingData', SchemaValidator(schemas.hotelBookingSchema),  controller.addHotelBookingData);

  app.get('/skyTrails/HotelBooking/getoneHotelBookingById/:id',controller.getoneHotelBookingById);

  app.post('/skyTrails/hotel/emailTicket', controller.emailTicket);

  // get all hotel booking for admin 

  app.post('/skyTrails/getAllHotelbookingListForAdmin', controller.getAllHotelBookingForAdmin);
}