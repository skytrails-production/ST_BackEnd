const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const agentController=require("../controllers/b2bauth.controller")
const subAdminController=require("../controllers/subAdminController");
const addWebBanner=require('../controllers/btocController/webAdvertisemnetController');
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
// const upload= require("../utilities/uploadErrorHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const eventController = require("../controllers/eventController");
const userSearchesController=require("../controllers/btocController/userSearchesController");
const packageControlelr=require("../controllers/btocController/packageBookingController");
const subAdminTaskControlelr=require("../controllers/subAdminTaskControlelr");
const pushNotification=require("../controllers/btocController/pushNotificationController");
const eventPromoBannerControler=require('../controllers/btocController/eventPromoBannerController');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
   app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.post("/skytrails/api/admin/approveAgent",SchemaValidator(schemas.approveAgentSchema),controller.approveAgent)
  app.post("/skytrails/api/user/socialLogin", SchemaValidator(schemas.socialLoginSchema),controller.socialLogin);
  app.post("/skytrails/api/admin/createSubAdmin", SchemaValidator(schemas.subAdminSchema),[authJwt.verifcationToken],subAdminController.createSubAdmin);
  app.put("/skytrails/api/admin/updateSubAdmin",upload.single('images'), SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.updateSubAdmin);
  app.delete("/skytrails/api/admin/deleteSubAdmin", SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.deleteSubAdmin);
  app.get("/skytrails/api/admin/getSubAdmin", subAdminController.getSubAdminByAggregate);
  app.post("/skytrails/api/admin/adminLogin",SchemaValidator(schemas.adminLoginSchema),controller.adminLogin);
  app.post("/skytrails/api/admin/subAdminLogin",SchemaValidator(schemas.subAdminLogin),subAdminController.subAdminLogin);
  app.put("/skytrails/api/admin/editprofile",upload.single('images'),[authJwt.verifcationToken],controller.editProfile)
  app.get("/skytrails/api/admin/getAgents", controller.getAgents);
  app.get("/skytrails/api/admin/getAllHotelBookingList",controller.getAllHotelBookingList);
  app.get("/skytrails/api/admin/getAllGrnHotelBookingList",controller.getAllGrnHotelBookingList);
  app.get("/skytrails/api/admin/getAllFlightBookingList",controller.getAllFlightBookingList);
  app.get("/skytrails/api/admin/adminDashBoard",controller.adminDashBoard);
  app.get("/skytrails/api/admin/getAllBusBookingList",controller.getAllBusBookingList);
  app.get("/skytrails/api/admin/getDataById",[authJwt.verifcationToken],controller.getDataById);
  app.put("/skytrails/api/admin/approveAgent",SchemaValidator(schemas.approveAgentSchema),controller.approveAgent)
  app.get("/skytrails/api/admin/getAllHotelBookingListAgent",controller.getAllHotelBookingListAgent);
  app.get("/skytrails/api/admin/getAllFlightBookingListAgent",controller.getAllFlightBookingListAgent);
  app.get("/skytrails/api/admin/getAllBusBookingListAgent",controller.getAllBusBookingListAgent);
  app.get("/skytrails/api/admin/getAllFixDepartureBooking", controller.getAllFixDepartureBooking);
  app.get("/skyTrails/api/admin/getchangeHotelRequestAgent",controller.getAgentchangeHotelRequest)
  app.get("/skyTrails/api/admin/getchangeFlightRequestAgent",controller.getAgentchangeFlightRequest);
  app.get("/skyTrails/api/admin/getchangeBusRequestAgent",controller.getAgentchangeBusRequest);
  app.get("/skyTrails/api/admin/getUserchangeFlightRequest",controller.getUserchangeFlightRequest)
  app.get("/skyTrails/api/admin/getMarkup",controller.getMarkup);
  app.post("/skyTrails/api/admin/createMarkup",SchemaValidator(schemas.markupSchema),controller.createMarkup);
  app.get('/skyTrails/api/admin/getCancelUserFlightBooking',controller.getCancelUserFlightBooking);
  app.get('/skyTrails/api/admin/getCancelUserHotelBooking',controller.getCancelUserHotelBooking);
  app.get('/skyTrails/api/admin/getCancelUserBusBooking',controller.getCancelUserBusBooking);
  app.get('/skyTrails/api/admin/getCancelAgentUserFlightBooking',controller.getCancelAgentFlightBooking);
  app.get('/skyTrails/api/admin/getCancelAgentHotelBooking',controller.getCancelAgentHotelBooking);
  app.get('/skyTrails/api/admin/getCancelAgentBusBooking',controller.getCancelAgentBusBooking);
  app.get('/skyTrails/api/admin/getSearchHistory',controller.getSearchHistory);
  app.post('/skyTrails/api/admin/createAgent',SchemaValidator(schemas.createAgentSchema),controller.createAgent);
  app.get('/skyTrails/api/admin/getAllUsers',controller.getAllUsers)
  app.put('/skyTrails/api/admin/updateSubAdminStatus',SchemaValidator(schemas.statusSchema),controller.statusChange);
  app.post('/skyTrails/api/admin/createWebAdvertisment',upload.single('images'),SchemaValidator(schemas.webAddSchema),addWebBanner.createWebAdvertisement);
  app.get('/skyTrails/api/admin/getWebAdds',addWebBanner.getAggregateWebAdvertisement);
  app.get('/skyTrails/api/admin/getAllEvents',eventController.getAllEventsAggregate);
  app.get('/skyTrails/api/admin/userSearchHistory',userSearchesController.getUserSerchHistory);
  app.get('/skyTrails/api/admin/getAllPackageEnquiry',packageControlelr.getAllPackageEnquiry);
  app.put('/skyTrails/api/admin/updateMarkup',SchemaValidator(schemas.updateMarkupSchema),controller.updateMarkup);
  app.post('/skyTrails/api/admin/createTask',subAdminTaskControlelr.createTask);
  app.post('/skyTrails/api/admin/pushNotification',pushNotification.pushNotificationsToUser);
app.get('/skyTrails/api/admin/getAllEventBookings',controller.getAllEventBookings);
app.get('/skyTrails/api/admin/getAllNotification/:adminId',pushNotification.getAllNotificationOfAmdin);
app.get('/skyTrails/api/admin/getNotificationById/:id',pushNotification.getNotificationById);
app.post('/skyTrails/api/admin/createAppVersion',controller.createAppVersion);
app.get('/skyTrails/api/admin/getAppVersion',controller.getAppVersion);
app.post('/skyTrails/api/admin/event/createPromoEvent',upload.single('images'),SchemaValidator(schemas.promoEventSchema),eventPromoBannerControler.createPromotinalBanner);
app.put('/skyTrails/api/admin/event/deletePromoEvent',SchemaValidator(schemas.deletPromoEventSchema),eventPromoBannerControler.deletePromoEvent);
app.delete('/skyTrails/api/admin/event/deletePermanentPromoEvent',SchemaValidator(schemas.deletPromoEventSchema),eventPromoBannerControler.deletePermanentPromoEvent);
app.get('/skyTrails/api/admin/event/getPromoEvent',eventPromoBannerControler.getPromotionalBanner);
app.post('/skyTrails/api/admin/distributeReward',controller.distributeReward);
app.put('/skyTrails/api/admin/event/updatePromotBanner',upload.single('images'),eventPromoBannerControler.updatePromotBanner);
app.post('/skyTrails/api/admin/refferral/createReferralAmount',controller.createReferralAmount);
app.get('/skyTrails/api/admin/reward/getReward',controller.getReferralAmount);
app.post('/skyTrails/api/admin/createPackaegBanner',upload.single('images'),controller.createPackageBanner);
app.post('/skyTrails/api/admin/createPopularDestination',upload.single('images'),controller.createPopularDestination);
app.put('/skyTrails/api/admin/updatePackageBanner',SchemaValidator(schemas.updatePackBannerSchema),controller.updateStatusBanner);
app.put('/skyTrails/api/admin/updatePopularDestination',SchemaValidator(schemas.updateDestinationSchema),controller.updatePopularDestination);
app.post('/skyTrails/api/admin/createPackageCategory',upload.single('images'),controller.createPackageCategory);
app.post('/skyTrails/api/admin/createDailyQuiz',controller.createDailyQuiz);
app.put('/skyTrails/api/admin/updateQuizStatus',controller.dailyQuizStatus);
app.delete("/skyTrails/api/admin/deleteAgent",agentController.deleteAgent);
app.get('/skyTrails/api/admin/getAllPackageEnquiryOnCRM',packageControlelr.packageEnquiryListForCrm);
};
