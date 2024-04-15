const controller = require("../controllers/b2bauth.controller");
const cancelController = require("../controllers/cancelTicketController")
const multer = require("multer");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
// Set up multer for image upload
const agentDashboardController=require('../controllers/b2bReferalsControler')



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/skyTrails/b2b/register", upload.single("file"), controller.RegisterUser);
  app.post("/skyTrails/b2b/agentlogo", upload.single("file"), controller.uploadAgentLogo);
  app.post("/skyTrails/b2b/login", controller.LoginUser);
  app.post("/skyTrails/user/update", controller.UserUpdate);
  app.delete("/skyTrails/user/delete", controller.deleteUser);
  app.get("/skyTrails/user/getallusers", controller.Getallusers);
  app.post("/skyTrails/user/setmarkup", controller.SetMarkup);
  app.get("/skyTrails/user/getmarkup/:userId", controller.GetMarkup);
  app.get("/skytrails/user/agentQueues", controller.agentQues)
  app.get("/skytrails/user/getAllAgentHotelBookingList", controller.getAllAgentHotelBookingList);
  app.get("/skytrails/user/getAllAgentFlightBookingList", controller.getAllAgentFlightBookingList);
  app.get("/skytrails/user/getAllAgentBusBookingList", controller.getAllAgentBusBookingList);
  //get singleuserbyid
  app.get("/skyTrails/user/:userId", controller.UserById);
  app.post('/skyTrails/b2b/updateProfile',  upload.single("file"), controller.updateProfile);

  //update password user by id

  app.patch("/skyTrails/user/changepassword", controller.UserChangePassword);

  //update balance route
  // app.post("/updateBalance", controller.updateUserBalance);
  //veryfiyrazorPay

  // app.post('/payVerify', controller.payVerify);

  //subtractBalance
  app.post("/skyTrails/subtractBalance", controller.subtractBalance);
  app.post("/skytrails/user/changeHotelDetailsRequest",SchemaValidator(schemas.changeRequest), controller.changeHotelDetailsRequest);
  app.post("/skytrails/user/changeFlightDetailsRequest",SchemaValidator(schemas.changeRequest), controller.changeFlightDetailsRequest);
  app.post("/skytrails/user/changeBusBookingDetailsRequest",SchemaValidator(schemas.changeBusRequest), controller.changeBusBookingDetailsRequest);
  app.post("/skytrails/api/agent/cancelFlightBooking",SchemaValidator(schemas.cancelFlightBookingSchema),cancelController.cancelFlightBooking);
  app.get("/skytrails/api/agent/getcancelFlightBooking",cancelController.getCancelFlightBooking);
  app.post("/skytrails/api/agent/cancelHotelBooking",SchemaValidator(schemas.cancelHotelBookingSchema),cancelController.cancelHotelBooking);
  app.get("/skytrails/api/agent/getCancelHotelBooking",cancelController.getCancelHotelBooking);
  app.post("/skytrails/api/agent/cancelBusBooking",SchemaValidator(schemas.cancelBusBookingSchema),cancelController.cancelBusBooking);
  app.get("/skytrails/api/agent/getCancelBusBooking",cancelController.getCancelBusBooking);


  //fixDeparture Route

  //sector 

  app.post("/skyTrails/addSector", controller.addSector);
  app.get("/skyTrails/getSector",controller.getSector);

  // fixDeparture
  app.post("/skyTrails/fixDeparturedata", controller.fixDeparturedata);
  app.get("/skyTrails/fixDeparturefilter",controller.fixDeparturefilter);

  //add fixDeparture Booking Details
  app.post("/skyTrails/fixDepartureBooking",controller.fixDepartureBooking);

  app.get("/skyTrails/getallfixdeparture",controller.getAllFixDepartureBooking);
  app.post("/skyTrails/updateFixDepartureData",controller.updateFixDepartureData);

  app.post('/upload/fixDepartureData', upload.single('file'),controller.upload);


  //easy Buzz payment

  app.post('/skyTrails/easebuzzPayment',SchemaValidator(schemas.transactionSchemaAgent),controller.easebuzzPayment);
  app.post('/skyTrails/successVerifyApi',controller.paymentSuccess);
  app.post('/skyTrails/paymentFailure',controller.paymentFailure);
 

  //agentProfilePage with packages

  app.get('/skyTrails/agent/:first_name', controller.agentProfilePage);
  app.get('/skyTrails/agent/inviteAgent/:userId',agentDashboardController.shareAgentReferralCode);
  app.get('/skyTrails/agent/getAllInvites/:userId',agentDashboardController.getReferrals);
  app.get('/skyTrails/agent/getAllInvitesBooking/:userId',agentDashboardController.getReferalBookings);
  app.get('/skyTrails/agent/checkValidReferralCode/:referralCode',controller.checkReferralCode);
  app.post('/skyTrails/agent/checkIsAgentExist',controller.checkIsExits)
};
