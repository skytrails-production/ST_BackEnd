const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const { handleFileUpload } = require("../utilities/uploadHandler");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const allowedFormats = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg"];
const checkapi=require("../controllers/intelliVisaController/apiCheck")
const visaCountryList=require("../controllers/intelliVisaController/countryVisaController");
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  app.post("/api/skyTrails/getToken",checkapi.getToken);
  app.post("/api/skyTrails/createApplicant",checkapi.createApplicant);
  app.post('/api/skyTrails/getTokenExchange', checkapi.getTokenExchange);
  app.get('/api/skyTrails/getApplicationCreationKey', checkapi.getApplicationCreationKey);
  app.get('/api/skyTrails/getCountryList', visaCountryList.getCountryList);
  app.get('/api/skyTrails/createRedirectURL',checkapi.createRedirectURL);
  };
  