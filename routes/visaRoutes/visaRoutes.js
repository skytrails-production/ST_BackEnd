const controller = require("../../controllers/visaController/visaController");
const visaBooking=require("../../controllers/visaController/visaBookingController");
const aiVisaBooking=require("../../controllers/intelliVisaController/applyVisa");

const auth = require("../../middleware/authJwt");
const schemas = require("../../utilities/schema.utilities");
const SchemaValidator = require("../../utilities/validations.utilities");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { authJwt } = require("../../middleware");
const saveAIVisaApplData=require("../../controllers/intelliVisaController/visaAppWithOpenAI")
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/skyTrails/visa/createVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createVisa)
  app.post("/skyTrails/api/visa/createVisa",upload.array("images"),controller.createVisa);
  app.get("/skyTrails/api/visa/getVisa", controller.getVisa);
  app.put("/skyTrails/api/visa/updateVisa", controller.updateVisa);
  app.delete("/skyTrails/api/visa/deleteVisa", controller.deleteVisa);
  app.get("/skyTrails/api/visa/getNoVisaList", controller.getNoVisaList);
  app.get("/skyTrails/api/visa/getMonthlyList", controller.getMonthlyList);
  app.get("/skyTrails/api/visa/getonArrivalList", controller.getonArrivalList);
  app.get("/skyTrails/api/visa/getWeeklyVisa",controller.getWeeklyVisa);
  app.get("/skyTrails/api/visa/getVisaById",controller.getVisaById);
  app.get("/skyTrails/api/visa/getAllVisaCountry",controller.getAllVisaCountry);
  app.post(
    '/skyTrails/api/visa/visaBooking',[authJwt.verifcationToken],
    upload.fields([{ name: 'passportImage', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
    // SchemaValidator(weeklyVisaSchema),
    visaBooking.visaBooking
  );
  app.post("/skyTrails/api/visa/createMultipleVisa",upload.any("images"),SchemaValidator(schemas.weeklyVisaSchema),controller.createMultipleVisas);
  app.get("/skyTrails/api/visa/getAIVisaCountry",controller.getAiVisaCountry);
  app.post("/skyTrails/api/visa/applyForAiVisa",aiVisaBooking.visaApplicationsReg);
  app.get("/skyTrails/api/visa/getVisaApplicationByUser",aiVisaBooking.getVisaApplicationByUser);
  app.put("/skyTrails/api/visa/updateApplicationDetails",aiVisaBooking.updateApplication);
  app.post("/skyTrails/api/visa/saveAiVisaData",upload.array("images"),aiVisaBooking.saveAIVisaApplData);
  app.post("/skyTrails/api/visa/saveDetails",upload.array("images"),saveAIVisaApplData.ImageDetails);
  app.post("/skyTrails/api/visa/uploadedDocsDetails",upload.array("images"),saveAIVisaApplData.uploadedDocsDetails);
  app.get("/skyTrails/api/visa/listAllApplicant",aiVisaBooking.listAllApplicant);
   app.put("/skyTrails/api/visa/updateApplicationDetails",aiVisaBooking.updateApplicationReg);
};