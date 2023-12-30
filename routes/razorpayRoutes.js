const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
const razorPayController=require("../controllers/razorpay/razorPayController") ;
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    app.post("/skytrails/api/payment/razorPayController", SchemaValidator(schemas.razorPaySchema),razorPayController.createOrder)
  
  
  }