// const {upload} = require('../../utilities/uploadHandler');
const Controller=require('../../controllers/btocController/controller')
const busBookingController = require('../../controllers/btocController/busBookingController');
const flightBookingController=require('../../controllers/btocController/flightBookingController');
const hotelBookingController=require('../../controllers/btocController/hotelBookingController');
const advertisementController=require('../../controllers/btocController/advertisementController');
const userCancelController=require('../../controllers/btocController/cancelTicketController');
const packageController=require('../../controllers/btocController/packageBookingController');
const changeRequestController=require('../../controllers/btocController/changeRequestController');
const userTransactionsController=require('../../controllers/btocController/userTransactionController');
const userSearchHistoryController=require('../../controllers/btocController/userSearchesController');
const userBookingFailed=require('../../controllers/btocController/userTransactionController');
const webAdvertismentController=require('../../controllers/btocController/webAdvertisemnetController');
const userRechargeController=require('../../controllers/btocController/userRechargeController')
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
    app.post('/skyTrails/api/user/busBooking',[authJwt.verifcationToken], busBookingController.busBooking);
    app.post('/skyTrails/api/user/flightBooking',[authJwt.verifcationToken],flightBookingController.flighBooking)
    app.post('/skyTrails/api/user/hotelBooking',[authJwt.verifcationToken], hotelBookingController.hotelBooking);
    // app.put('/skyTrails/api/user/', controller.updatePost);
    // app.delete('/skyTrails/api/user/', controller.deletePost);
    app.get('/skyTrails/api/user/getUserflightBooking',[authJwt.verifcationToken],flightBookingController.getUserflightBooking);
    app.get('/skyTrails/api/user/getUserFlightData',[authJwt.verifcationToken],flightBookingController.getUserFlightData);

    app.get('/skyTrails/api/user/getUserBusBooking',[authJwt.verifcationToken],busBookingController.getBusBookingList);
    app.get('/skyTrails/api/user/getUserHotelBooking',[authJwt.verifcationToken],hotelBookingController.getAllHotelBookingList);
    // [authJwt.verifcationToken]
    app.get('/skyTrails/api/user/getUserHotelData',[authJwt.verifcationToken],hotelBookingController.getUserHotelData);
    app.get('/skyTrails/api/user/getUserBusData',[authJwt.verifcationToken],busBookingController.getUserBusData);
    app.post('/skyTrails/api/admin/createadvertisment',upload.single("images"),SchemaValidator(schemas.advertisementSchema), advertisementController.createadvertismentController);
    app.put('/skyTrails/api/admin/updateadvertisement',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getadvertisement',advertisementController.getadvertisementController);
    app.post('/skyTrails/api/admin/createflightadvertisment',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createflightadvertismentController);
    app.put('/skyTrails/api/admin/updateflightadvertisement',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getflightadvertisement',advertisementController.getflightadvertisementController);
    app.post('/skyTrails/api/admin/createbustadvertisment',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createbustadvertismentController);
    app.put('/skyTrails/api/admin/updatebusadvertisement',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatebusadvertisementController);
    app.get('/skyTrails/api/getbusadvertisement',advertisementController.getbusadvertisementController);
    app.post('/skyTrails/api/admin/createhoteladvertisment',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createhoteladvertismentController);
    app.put('/skyTrails/api/admin/updatehoteladvertisement',upload.single("images"),[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatehoteladvertisementController);
    app.get('/skyTrails/api/gethoteladvertisement',advertisementController.gethoteladvertisementController);
    app.post('/skyTrails/api/user/cancelUserHotelBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserHotelBookingSchema),userCancelController.cancelUserHotelBooking);
    app.post('/skyTrails/api/user/cancelUserFlightBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserFlightBookingSchema),userCancelController.cancelUserFlightBooking)
    app.post('/skyTrails/api/user/cancelUserBusBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserBusBookingSchema),userCancelController.cancelUserBusBooking)
    app.get('/skyTrails/api/user/getCancelUserFlightBooking',[authJwt.verifcationToken],userCancelController.getCancelUserFlightBooking);
    app.get('/skyTrails/api/user/getCancelUserHotelBooking',[authJwt.verifcationToken],userCancelController.getCancelUserHotelBooking);
    app.get('/skyTrails/api/user/getCancelUserBusBooking',[authJwt.verifcationToken],userCancelController.getCancelUserBusBooking);
    app.post('/skyTrails/api/user/packageBookingEnquiry',[authJwt.verifcationToken],SchemaValidator(schemas.packageBookingSchema),packageController.packageBooking);
    app.get('/skyTrails/api/user/getPackageBookigs',[authJwt.verifcationToken],packageController.getPackageBookigs);
     app.post('/skyTrails/api/user/changeUserFlightBooking',[authJwt.verifcationToken],SchemaValidator(schemas.changeUserRequest),changeRequestController.createFlightTicketChangeRequest)
    // app.post('/skyTrails/api/user/cancelUserBusBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserBusBookingSchema),changeRequestController.cancelUserBusBooking)
    app.get('/skyTrails/api/user/getChangelUserFlightBooking',[authJwt.verifcationToken],changeRequestController.getUserFlightChangeRequest);
    // app.get('/skyTrails/api/user/getCancelUserHotelBooking',changeRequestController.getCancelUserHotelBooking);
    // app.get('/skyTrails/api/user/getCancelUserBusBooking',changeRequestController.getCancelUserBusBooking);
    app.post('/skyTrails/api/user/makepayment',[authJwt.verifcationToken],userTransactionsController.makePayment);
    app.post('/skyTrails/api/user/payVerify',[authJwt.verifcationToken],SchemaValidator(schemas.paymentUrlSchema),userTransactionsController.payVerify);
    app.post('/skyTrails/api/user/createSearchHistory',[authJwt.verifcationToken],SchemaValidator(schemas.searchSchema),userSearchHistoryController.createSearchHistory);
    app.post('/skyTrails/api/user/sendTicketPDF',[authJwt.verifcationToken],SchemaValidator(schemas.sendPDFSchema),flightBookingController.sendPDF);
    app.post('/skyTrails/api/user/userBookingFailed',[authJwt.verifcationToken],SchemaValidator(schemas.bookingFailed),userBookingFailed.bookingFailedUser)
    app.get('/skyTrails/api/user/getWebBanner',webAdvertismentController.getWebAdvertisement);
    app.get('/skyTrails/flight/bookings/:bookingId',flightBookingController.getFlightBookingById);
    app.get('/skyTrails/hotel/bookings/:bookingId',hotelBookingController.getUserHotelBookingById);
    app.get('/skyTrails/bus/bookings/:bookingId',busBookingController.getUserBusBookingById);
    app.get('/skyTrails/package/bookings/:bookingId',packageController.getPackageEnquiryById);
    app.post('/skyTrails/api/notification/sendNotification',webAdvertismentController.sendNotification);

    app.post('/skyTrails/api/user/recharge/createRechareData',[authJwt.verifcationToken],userRechargeController.createRechargeHistory)
    
    app.get("/skyTrails/api/user/getRechargeHistory",[authJwt.verifcationToken], userRechargeController.getReachargeHistory);
    app.get("/skyTrails/api/user/getTransactionHistory",[authJwt.verifcationToken], Controller.getReachargeHistory);
    app.get("/skyTrails/api/user/getUrl/:mobileNumber",Controller.getAppLink);
    app.put("/skyTrails/api/user/updateDeviceToken",[authJwt.verifcationToken],Controller.updateDeviceToken);
    app.get("/skyTrails/api/user/shareReferral/shareReferralCode",[authJwt.verifcationToken],Controller.shareReferralCode);
    app.post("/skyTrails/api/user/packageBookNow",[authJwt.verifcationToken],SchemaValidator(schemas.packageBookNowSchema),packageController.packageBookNow);
    app.get("/skyTrails/api/user/getPackageBookNow",[authJwt.verifcationToken],packageController.getUserPackageBooking);
    app.post("/skyTrails/api/user/shareReferral/shareReferralCodeToUrContact",[authJwt.verifcationToken],Controller.shareReferralCodeSMSWHTSAPP);
    app.get("/skyTrails/api/user/wallet/getWalletHistory",[authJwt.verifcationToken],Controller.getWalletHistory);
    app.post("/skyTrails/api/user/wallet/redeemCoin",[authJwt.verifcationToken],Controller.redeemCoin);
    app.get("/skyTrails/api/user/getSkyCoins",[authJwt.verifcationToken],Controller.getUserBalance);
    app.get("/skyTrails/api/user/getUserById",Controller.getUserById);



    //get flight booking by userId

    app.get('/skyTrails/api/user/flightBooking/:id',flightBookingController.getFlightBookingByUserId);
  

}
