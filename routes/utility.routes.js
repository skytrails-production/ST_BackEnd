const controller = require("../controllers/utility.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/skyTrails/api/Login/UserLogin", controller.userLogin);
  app.post("/skyTrails/api/Admin/GetUserBalance", controller.getUserBalance);
  app.post("/skyTrails/api/PromoCode/GetPromoServices", controller.getPromoService);
  app.post("/skyTrails/api/PromoCode/GetPromoCode", controller.getPromoCode);
  app.post("/skyTrails/api/Admin/OTP", controller.getOTP);
  app.post("/skyTrails/api/Admin/VerifyOTP", controller.getVerifyOTP);

  app.post("/skyTrails/api/Recharge/GetService", controller.getService);

  app.post("/skyTrails/api/Recharge/GetRechargePlan", controller.getRechargePlan);

  app.post(
    "/skyTrails/api/Recharge/GetRechargePlanDetail",
    controller.getRechargePlanDetails
  );

  app.post("/skyTrails/api/Recharge/Recharge/", controller.rechageRequest);




  //billign api

  app.post("/skyTrails/api/bill/getbillservice", controller.getBillService);
  app.post("/skyTrails/api/bill/getbillserviceparamemter", controller.getBillServiceParamemter);
  app.post("/skyTrails/api/bill/savebillpayment", controller.saveBillPayment);
};
