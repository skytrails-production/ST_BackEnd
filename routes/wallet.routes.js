const controller = require("../controllers/wallet.controller");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/skyTrails/wallet/add_amount',SchemaValidator(schemas.walletSchema),controller.add_amount);
  app.put(
    "/skyTrails/wallet/update_amount/:id",
    SchemaValidator(schemas.addwalletAmountSchema),
    controller.update_amount
  );
  app.get("/skyTrails/wallet/showWallet/:id", controller.showWallet);
  app.post(
    "/skyTrails/wallet/pay_amount/:id",
    SchemaValidator(schemas.payWalletAmount),
    controller.pay_amount
  );
  app.get("/skyTrails/wallet/showTransactions/:id", controller.showTransactions);
  app.post("/skyTrails/wallet/rechargeWallet", controller.rechargeWallet);
  // app.post("/skyTrails/wallet/updateRozarPay", controller.updateRozarPay);
};
