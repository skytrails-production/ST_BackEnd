const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
const offlinequeryController=require("../controllers/offlineQueryController");
const userInquiryController=require("../controllers/btocController/userInquiryController");
const { user } = require("../model");
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    app.post("/skytrails/api/query/createofflineQuery", SchemaValidator(schemas.offlineQuerySchema),offlinequeryController.createofflineQuery)
  
  app.get("/skytrails/api/query/getOfflineQuery",offlinequeryController.getOfflineQuery);
  app.put("/skytrails/api/query/updateOfflineQuery",SchemaValidator(schemas.updateofflineQuerySchema),offlinequeryController.updateOfflineQuery)
  app.post("/skytrails/api/user/query/createuserInquiry", SchemaValidator(schemas.userInquirySchema),userInquiryController.userInquiriesEntry)
  app.get("/skytrails/api/user/query/AllInquiriesList",userInquiryController.getAllInquiriesList)
  app.put("/skytrails/api/admin/query/resolveQuery",userInquiryController.updateInquiryResolved)
  
  
  }