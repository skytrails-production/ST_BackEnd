const controller = require("../../controllers/visaController/documentTypeController");
const auth = require("../../middleware/authJwt");
const SchemaValidator = require("../../utilities/validations.utilities");
const schemas = require("../../utilities/schema.utilities");
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    // app.post('/skyTrails/visa/createVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createVisa)
    app.post("/skyTrails/api/visa/document/createDocType",SchemaValidator(schemas.createDocSchema),controller.crerateDocType);
    app.get("/skyTrails/api/visa/document/getDocType", controller.getDocType);
    app.get("/skyTrails/api/visa/document/getDocTypeById",controller.getDocTypeById)
  };