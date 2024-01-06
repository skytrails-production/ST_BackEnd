const controller = require("../../controllers/visaController/visaCategoryController");
const auth = require("../../middleware/authJwt");
const SchemaValidator = require("../../utilities/validations.utilities");
const schemas = require("../../utilities/schema.utilities");
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    // app.post('/skyTrails/visa/createVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createVisa)
    app.post("/skyTrails/api/visa/createVisaCategory",SchemaValidator(schemas.createVisaCategorySchema),controller.createVisaCategory);
    app.get("/skyTrails/api/visa/getVisaCategory", controller.getVisaCategory);
    app.get("/skyTrails/api/visa/getVisaCategoryById",controller.getVisaCategoryById)
  };