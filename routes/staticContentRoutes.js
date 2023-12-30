const { authJwt } = require("../middleware");
const controller = require("../controllers/staticContentController");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post('/skyTrails/staticContent/createStaticContent', SchemaValidator(schemas.staticContentSchema), controller.createStaticContent)
  app.get('/skyTrails/staticContent/listStaticContent', controller.listStaticContent)
  app.put('/skyTrails/staticContent/updatestaticContent', controller.updateStaticContent)
  app.delete('/skyTrails/staticContent/deletestaticContent', controller.deleteStaticContent);
};
