const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");
const userController = require("../controllers/btocController/controller");
const { handleFileUpload } = require("../utilities/uploadHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/skytrails/api/user/mobileLogin",
    SchemaValidator(schemas.btoCuserLoginSchema),
    userController.login
  );
  
  app.put(
    "/skytrails/api/user/verifyUserOtp",
    SchemaValidator(schemas.userVerifySchema),
    [authJwt.verifcationToken],
    userController.verifyUserOtp
  );
  app.put(
    "/skytrails/api/user/resendOtp",
    SchemaValidator(schemas.btoCuserLoginSchema),
    userController.resendOtp
  );
  app.get(
    "/skytrails/api/user/getUserProfile",
    [authJwt.verifcationToken],
    userController.getUserProfile
  );
  app.put(
    "/skytrails/api/user/uploadImage",
    upload.single("images"),
    [authJwt.verifcationToken],
    userController.uploadImage
  );
  app.put(
    "/skyTrails/api/user/updateLocation",
    [authJwt.verifcationToken],
    SchemaValidator(schemas.updateLocationSchema),
    userController.updateLocation
  );
  app.put("/skyTrails/api/user/forgetPassword", userController.forgetPassword);
  app.put(
    "/skyTrails/api/user/verifyUserOtpWithSocialId",
    SchemaValidator(schemas.userVerifySchema),
    [authJwt.verifcationToken],
    userController.verifyUserOtpWithSocialId
  );
  app.put(
    "/skytrails/api/user/editProfile",
    [authJwt.verifcationToken],
    userController.editProfile
  );

  app.delete("/skyTrails/api/user/deleteProfile",[authJwt.verifcationToken],userController.deleteUserAccount)

  app.put("/skytrails/api/user/updateEmail",[authJwt.verifcationToken],SchemaValidator(schemas.updateEmailSchema),userController.updateEmail);
  app.post("/skytrails/api/user/loginWithMailMobileLogin",SchemaValidator(schemas.btoCuserLoginSchema),userController.loginWithMailMobileLogin);
  app.post('/skytrails/api/user/sendOTPOnSMS',userController.sendOtpOnSMS);
  app.put("/skytrails/api/user/verifyUserOtp1",SchemaValidator(schemas.userVerifySchema),[authJwt.verifcationToken],userController.verifyUserOtpMailMobile);
  app.put("/skytrails/api/user/resendOtp1",SchemaValidator(schemas.btoCuserLoginSchema),userController.resendOtpMailMobile);
  app.get("/skyTrails/api/user/getValueOfCoin",userController.getValueOfCoin);
  app.post("/skyTrails/api/user/updatemihuruwallet", userController.updateMihuruWallet);
  app.get("/skyTrails/api/user/checkFirstBooking",[authJwt.verifcationToken],userController.checkFirstBooking);
  app.post("/skyTrails/api/user/socialLogin",userController.socialLogin);
  app.put("/skyTrails/api/user/addPhoneNumber",[authJwt.verifcationToken],userController.addMobileNumber)
};
