const controller = require("../../controllers/visaController/requireDocumentController");
const auth = require("../../middleware/authJwt");
const SchemaValidator = require("../../utilities/validations.utilities");
const schemas = require("../../utilities/schema.utilities");
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    // app.post('/skyTrails/visa/createVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createVisa)
    app.post("/skyTrails/api/visa/document/createRequireDocument",SchemaValidator(schemas.docRequireSchema),controller.createRequireDocument);
    app.get("/skyTrails/api/visa/document/getRequireDocument", controller.getRequireDocument);
  
    app.get("/skyTrails/api/visa/document/getRequireDocumentById",controller.getRequireDocumentById);
    app.get("/skyTrails/api/visa/document/getRequireDocumentPerCountry",controller.getRequireDocumentPerCountry)
  };