const controller = require("../../controllers/visaController/visaController");
const auth = require("../../middleware/authJwt");
const schemas = require("../../utilities/schema.utilities");
const SchemaValidator = require("../../utilities/validations.utilities");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/skyTrails/visa/createVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createVisa)
  app.post(
    "/skyTrails/api/visa/createVisa",
    SchemaValidator(schemas.weeklyVisaSchema),
    controller.createVisa
  );
  app.get("/skyTrails/api/visa/getVisa", controller.getVisa);
  app.put("/skyTrails/api/visa/updateVisa", controller.updateVisa);
  app.delete("/skyTrails/api/visa/deleteVisa", controller.deleteVisa);
  app.get("/skyTrails/api/visa/getNoVisaList", controller.getNoVisaList);
  app.get("/skyTrails/api/visa/getMonthlyList", controller.getMonthlyList);
  app.get("/skyTrails/api/visa/getonArrivalList", controller.getonArrivalList);
  app.get("/skyTrails/api/visa/getWeeklyVisa",controller.getWeeklyVisa);
  app.get("/skyTrails/api/visa/getVisaById",controller.getVisaById);
  app.get("/skyTrails/api/visa/getAllVisaCountry",controller.getAllVisaCountry)
};