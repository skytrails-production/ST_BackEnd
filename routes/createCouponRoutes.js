const couponController = require("../controllers/btocController/couponCodeController");
const schemas = require("../utilities/schema.utilities");
const SchemaValidator = require("../utilities/validations.utilities");
// const uploadHandle=require("../utilities/uploadImages");
const { authJwt } = require("../middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post(
  //   "/skyTrails/busBooking/addBusBookingData",
  //   SchemaValidator(schemas.busBookingSchema),
  //   controller.addBusBookingData
  // );
  app.post('/skyTrails/api/admin/createCoupons',upload.single('images'),SchemaValidator(schemas.createCouponSchema),couponController.createCoupons);
  app.get('/skyTrails/api/coupons/getCoupons',couponController.getAllCoupons);
  app.get('/skyTrails/api/coupons/getCouponsById',couponController.getCouponById);
  app.put('/skyTrails/api/coupons/applyCoupon',[authJwt.verifcationToken],SchemaValidator(schemas.applyCouponSchema),couponController.applyCoupon);
  app.get('/skyTrails/api/coupons/couponApplied/:couponCode',[authJwt.verifcationToken],couponController.CouponApplied)
};
